import type { Request, Response } from "express";
import admin from "../firebase";
import Room from "../models/RoomModel";
import User from "../models/UserModel";

const publicUser = (user: { _id: unknown; firstName: string; lastName: string; username: string; email: string; firebaseUID: string }) => ({
  id: String(user._id),
  firstName: user.firstName,
  lastName: user.lastName,
  username: user.username,
  email: user.email,
  firebaseUID: user.firebaseUID,
});

const duplicateMessage = (error: unknown) => {
  if (typeof error === "object" && error !== null && "code" in error && error.code === 11000) {
    return "El email o username ya esta en uso.";
  }
  return "No se pudo completar la operacion.";
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

    return res.status(201).json({ user: publicUser(user) });
  } catch (error) {
    if (firebaseUID) {
      await admin.auth().deleteUser(firebaseUID).catch(() => undefined);
    }
    return res.status(400).json({ message: duplicateMessage(error) });
  }
};

const getMe = async (req: Request, res: Response) => {
  if (!req.currentUser) return res.status(401).json({ message: "Tenes que iniciar sesion." });
  return res.status(200).json({ user: publicUser(req.currentUser) });
};

const updateMe = async (req: Request, res: Response) => {
  if (!req.currentUser) return res.status(401).json({ message: "Tenes que iniciar sesion." });

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

    if (!user) return res.status(404).json({ message: "Usuario no encontrado." });
    await admin.auth().updateUser(user.firebaseUID, { displayName: user.username });
    return res.status(200).json({ user: publicUser(user) });
  } catch (error) {
    return res.status(400).json({ message: duplicateMessage(error) });
  }
};

const deleteMe = async (req: Request, res: Response) => {
  if (!req.currentUser) return res.status(401).json({ message: "Tenes que iniciar sesion." });

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
