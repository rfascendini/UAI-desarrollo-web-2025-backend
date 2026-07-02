import { Router } from "express";
import UserRoutes from "./UserRoutes.js";
import RoomRoutes from "./RoomRoutes.js";

const router = Router();

router.use("/users", UserRoutes);
router.use("/rooms", RoomRoutes);

export default router;
