import express from "express";
import controllers from "../controllers/RoomController";
import validationMiddleware from "../middleware/ValidatorMiddleware";
import { authenticateFirebase } from "../middleware/AuthMiddleware";
import {
  createRoomValidationScheme,
  joinRoomValidationScheme,
  memberValidationScheme,
  movePlayerValidationScheme,
  roomIdParamValidationScheme,
  updateRoomValidationScheme,
} from "../validators/roomVallidation";

const RoomRoutes = express.Router();

RoomRoutes.use(authenticateFirebase);

RoomRoutes.get("/my-room", controllers.getMyRoom);
RoomRoutes.get("/", controllers.getAllRooms);
RoomRoutes.post("/", validationMiddleware(createRoomValidationScheme), controllers.createRoom);
RoomRoutes.patch("/:id", validationMiddleware(roomIdParamValidationScheme, "params"), validationMiddleware(updateRoomValidationScheme), controllers.updateRoom);
RoomRoutes.post("/:id/join", validationMiddleware(roomIdParamValidationScheme, "params"), validationMiddleware(joinRoomValidationScheme), controllers.joinRoom);
RoomRoutes.post("/:id/leave", validationMiddleware(roomIdParamValidationScheme, "params"), controllers.leaveRoom);
RoomRoutes.post("/:id/close", validationMiddleware(roomIdParamValidationScheme, "params"), controllers.closeRoom);
RoomRoutes.post("/:id/kick", validationMiddleware(roomIdParamValidationScheme, "params"), validationMiddleware(memberValidationScheme), controllers.kickPlayer);
RoomRoutes.post("/:id/move", validationMiddleware(roomIdParamValidationScheme, "params"), validationMiddleware(movePlayerValidationScheme), controllers.movePlayer);
RoomRoutes.post("/:id/transfer", validationMiddleware(roomIdParamValidationScheme, "params"), validationMiddleware(memberValidationScheme), controllers.transferHost);

export default RoomRoutes;
