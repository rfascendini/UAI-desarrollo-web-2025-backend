import express from "express";
import controllers from "../controllers/UserController";
import validationMiddleware from "../middleware/ValidatorMiddleware";
import createUserValidationScheme from "../validators/userValidation";
import { authenticateFirebase } from "../middleware/AuthMiddleware";

const UserRoutes = express.Router();

// CRUD (protegidos)
UserRoutes.post("/", authenticateFirebase, validationMiddleware(createUserValidationScheme), controllers.createUser);
UserRoutes.patch("/:id", authenticateFirebase, controllers.updateUser);
UserRoutes.delete("/hard/:id", authenticateFirebase, controllers.hardDeleteUser);
UserRoutes.patch("/soft/:id", authenticateFirebase, controllers.softDeleteUser);
UserRoutes.get("/:id", authenticateFirebase, controllers.getUserById);
UserRoutes.get("/", authenticateFirebase, controllers.getAllUsers);

// AUTH (públicos)
UserRoutes.post("/login", controllers.loginUser);
UserRoutes.post("/logout", controllers.logoutUser);
UserRoutes.post("/register", validationMiddleware(createUserValidationScheme), controllers.registerUser);

export default UserRoutes;
