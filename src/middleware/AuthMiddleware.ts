import type { Request, Response, NextFunction } from "express";
import admin from "../firebase";
import User from "../models/UserModel";

const authenticateFirebase = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Tenes que iniciar sesion." });
  }

  const idToken = authHeader.slice("Bearer ".length);

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const currentUser = await User.findOne({ firebaseUID: decodedToken.uid, isActive: 1 });

    if (!currentUser) {
      return res.status(401).json({ message: "El usuario no existe o esta inactivo." });
    }

    req.auth = {
      uid: decodedToken.uid,
      email: decodedToken.email,
    };
    req.currentUser = currentUser;
    return next();
  } catch {
    return res.status(401).json({ message: "Token invalido o vencido." });
  }
};

export { authenticateFirebase };
