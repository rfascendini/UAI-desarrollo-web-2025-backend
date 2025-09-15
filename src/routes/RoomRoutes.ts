import express from "express";

import controllers from "../controllers/RoomController";

const RoomRoutes = express.Router();

RoomRoutes.post("/", controllers.createRoom);
RoomRoutes.patch("/:id", controllers.updateRoom)
RoomRoutes.delete("/hard/:id", controllers.hardDeleteRoom)
RoomRoutes.delete("/hard/:id", controllers.softDeleteRoom)
RoomRoutes.get("/:id", controllers.getRoomById);
RoomRoutes.get("/", controllers.getAllRooms);

export default RoomRoutes;
