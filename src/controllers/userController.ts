import User from "../models/UserModel";
import { Request, Response } from "express";
import admin from "../firebase";
import axios from "axios";

/* =========================
   CRUD
   ========================= */
const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
};

const getUserById = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user", error });
  }
};

const createUser = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    const user = new User({ firstName, lastName, email, password });
    await user.save();
    res.status(201).json({ message: "User created", user });
  } catch (error) {
    res.status(500).json({ message: "Error creating user", error });
  }
};

const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, email, password } = req.body;
    const user = await User.findByIdAndUpdate(
      id,
      { firstName, lastName, email, password },
      { new: true }
    );
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ message: "User updated", user });
  } catch (error) {
    res.status(500).json({ message: "Error updating user", error });
  }
};

const hardDeleteUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ message: "User hard deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error hard deleting user", error });
  }
};

const softDeleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;
    const user = await User.findByIdAndUpdate(id, { isActive }, { new: true });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ message: "User soft deleted", user });
  } catch (error) {
    res.status(500).json({ message: "Error soft deleting user", error });
  }
};

/* =========================
   AUTH
   ========================= */

// REGISTRO: crea en Firebase y en Mongo; si Mongo falla, hace rollback en Firebase
const registerUser = async (req: Request, res: Response) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: "firstName, lastName, email and password are required" });
    }

    // 1) Crear usuario en Firebase
    const userRecord = await admin.auth().createUser({ email, password });

    try {
      // 2) Guardar en Mongo – respetar nombres EXACTOS del schema
      const user = new User({
        firstName,
        lastName,
        email,
        password,              // ⚠️ En producción, hashear antes (bcrypt)
        firebaseUID: userRecord.uid, // ⚠️ Mayúsculas tal cual en el schema
      });

      await user.save();

      return res.status(201).json({ firebaseUser: userRecord, user });
    } catch (dbErr: any) {
      // Rollback si falla Mongo
      await admin.auth().deleteUser(userRecord.uid);
      return res.status(500).json({ message: "Error while registering user (db)", error: dbErr.message || dbErr });
    }
  } catch (error: any) {
    return res.status(500).json({ message: "Error while registering user", error: error.message || error });
  }
};

// LOGIN: usa REST de Firebase; además devuelve el user local si existe
const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const apiKey = process.env.FIREBASE_API_KEY;
    const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`;
    const response = await axios.post(url, {
      email,
      password,
      returnSecureToken: true,
    });

    const localUser = await User.findOne({ email });

    return res.status(200).json({
      idToken: response.data.idToken,
      refreshToken: response.data.refreshToken,
      expiresIn: response.data.expiresIn,
      localId: response.data.localId, // uid Firebase
      user: localUser || null,
    });
  } catch (error: any) {
    return res.status(401).json({
      message: "Login failed",
      error: error.response?.data || error.message,
    });
  }
};

// LOGOUT: revoca refresh tokens del usuario en Firebase
const logoutUser = async (req: Request, res: Response) => {
  try {
    const { firebaseUID } = req.body; // ⚠️ MISMO nombre que en el schema

    if (!firebaseUID) {
      return res.status(400).json({ message: "firebaseUID is required" });
    }

    await admin.auth().revokeRefreshTokens(firebaseUID);

    return res.status(200).json({ message: "User logged out successfully" });
  } catch (error: any) {
    return res.status(500).json({ message: "Error while logging out", error: error.message || error });
  }
};

export default {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  hardDeleteUser,
  softDeleteUser,
  registerUser,
  loginUser,
  logoutUser,
};
