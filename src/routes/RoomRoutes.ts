import express from "express";

import controllers from "../controllers/RoomController";

const RoomRoutes = express.Router();

RoomRoutes.post("/", controllers.createRoom);
RoomRoutes.get("/:id", controllers.getRoomById);
RoomRoutes.get("/", controllers.getAllRooms);

export default RoomRoutes;
