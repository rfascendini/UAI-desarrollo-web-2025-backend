import type { Request, Response } from "express";
import admin from "../firebase.js";
import Room from "../models/RoomModel.js";
import User from "../models/UserModel.js";
import { errorResponse, type FieldErrors } from "../utils/responses.js";

type MongoDuplicateError = {
  code?: number;
  keyPattern?: Record<string, number>;
};

const duplicateUserError = (error: unknown): FieldErrors | null => {
  const mongoError = error as MongoDuplicateError;
  if (mongoError.code !== 11000) return null;

  if (mongoError.keyPattern?.email) {
    return { email: ["Este correo electrónico ya se encuentra registrado."] };
  }

  if (mongoError.keyPattern?.username) {
    return { username: ["Este usuario ya se encuentra registrado."] };
  }

  return {
    email: ["El correo electrónico o el usuario ya se encuentra registrado."],
    username: ["El correo electrónico o el usuario ya se encuentra registrado."],
  };
};

const registerUser = async (req: Request, res: Response) => {
  const { email, password, firstName, lastName, username } = req.body;
  let firebaseUID: string | null = null;

  try {
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: username,
      emailVerified: false,
    });
    firebaseUID = userRecord.uid;

    const user = await User.create({
      firstName,
      lastName,
      username,
      email,
      firebaseUID,
      isActive: 1,
    });

    return res.status(201).json({
      user: {
        id: String(user._id),
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        email: user.email,
        firebaseUID: user.firebaseUID,
      },
    });
  } catch (error) {
    if (firebaseUID) {
      await admin.auth().deleteUser(firebaseUID).catch(() => undefined);
    }

    const duplicateErrors = duplicateUserError(error);
    if (duplicateErrors) {
      return errorResponse(res, 409, "Ya existe una cuenta con esos datos.", duplicateErrors);
    }

    return errorResponse(res, 400, "No se pudo registrar el usuario.");
  }
};

const getMe = async (req: Request, res: Response) => {
  if (!req.currentUser) return errorResponse(res, 401, "Tenés que iniciar sesión.");

  return res.status(200).json({
    user: {
      id: String(req.currentUser._id),
      firstName: req.currentUser.firstName,
      lastName: req.currentUser.lastName,
      username: req.currentUser.username,
      email: req.currentUser.email,
      firebaseUID: req.currentUser.firebaseUID,
    },
  });
};

const updateMe = async (req: Request, res: Response) => {
  if (!req.currentUser) return errorResponse(res, 401, "Tenés que iniciar sesión.");

  try {
    const user = await User.findByIdAndUpdate(
      req.currentUser._id,
      {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        username: req.body.username,
      },
      { new: true, runValidators: true, collation: { locale: "en", strength: 2 } }
    );

    if (!user) return errorResponse(res, 404, "Usuario no encontrado.");
    await admin.auth().updateUser(user.firebaseUID, { displayName: user.username });

    return res.status(200).json({
      user: {
        id: String(user._id),
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        email: user.email,
        firebaseUID: user.firebaseUID,
      },
    });
  } catch (error) {
    const duplicateErrors = duplicateUserError(error);
    if (duplicateErrors) {
      return errorResponse(res, 409, "Ya existe una cuenta con esos datos.", duplicateErrors);
    }

    return errorResponse(res, 400, "No se pudo actualizar el perfil.");
  }
};

const deleteMe = async (req: Request, res: Response) => {
  if (!req.currentUser) return errorResponse(res, 401, "Tenés que iniciar sesión.");

  const userId = req.currentUser._id;

  await Room.updateMany({ createdBy: userId, isDeleted: false }, { $set: { isDeleted: true } });
  await Room.updateMany(
    { createdBy: { $ne: userId }, "users.user": userId, isDeleted: false },
    { $pull: { users: { user: userId } } }
  );
  await User.findByIdAndUpdate(userId, { isActive: 0 });
  await admin.auth().deleteUser(req.currentUser.firebaseUID);

  return res.status(200).json({ message: "Cuenta eliminada." });
};

export default {
  registerUser,
  getMe,
  updateMe,
  deleteMe,
};
