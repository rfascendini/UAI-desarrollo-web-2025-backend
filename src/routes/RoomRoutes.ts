import express from "express";

import controllers from "../controllers/RoomController";
import { authenticateFirebase } from "../middleware/AuthMiddleware";

const RoomRoutes = express.Router();

RoomRoutes.post("/", authenticateFirebase, controllers.createRoom);
RoomRoutes.patch("/:id", authenticateFirebase, controllers.updateRoom)
RoomRoutes.delete("/hard/:id", authenticateFirebase, controllers.hardDeleteRoom)
RoomRoutes.delete("/hard/:id", authenticateFirebase, controllers.softDeleteRoom)
RoomRoutes.get("/:id", authenticateFirebase, controllers.getRoomById);
RoomRoutes.get("/", authenticateFirebase, controllers.getAllRooms);

export default RoomRoutes;
