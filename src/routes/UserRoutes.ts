import express from "express";
import controllers from "../controllers/UserController";
import validationMiddleware from "../middleware/ValidatorMiddleware";
import { registerUserValidationScheme, updateProfileValidationScheme } from "../validators/UserValidation";
import { authenticateFirebase } from "../middleware/AuthMiddleware";

const UserRoutes = express.Router();

UserRoutes.post("/register", validationMiddleware(registerUserValidationScheme), controllers.registerUser);
UserRoutes.get("/me", authenticateFirebase, controllers.getMe);
UserRoutes.patch("/me", authenticateFirebase, validationMiddleware(updateProfileValidationScheme), controllers.updateMe);
UserRoutes.delete("/me", authenticateFirebase, controllers.deleteMe);

export default UserRoutes;
