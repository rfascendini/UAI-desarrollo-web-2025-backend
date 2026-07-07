import type { Request, Response, NextFunction } from "express";
import admin from "../firebase.js";
import User from "../models/UserModel.js";
import { errorResponse } from "../utils/responses.js";

const authenticateFirebase = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return errorResponse(res, 401, "Tenés que iniciar sesión.");
  }

  const idToken = authHeader.slice("Bearer ".length);

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const currentUser = await User.findOne({ firebaseUID: decodedToken.uid, isActive: 1 });

    if (!currentUser) {
      return errorResponse(res, 401, "El usuario no existe o está inactivo.");
    }

    req.auth = {
      uid: decodedToken.uid,
      email: decodedToken.email,
    };
    req.currentUser = currentUser;
    return next();
  } catch {
    return errorResponse(res, 401, "Tu sesión venció. Iniciá sesión nuevamente.");
  }
};

export { authenticateFirebase };
