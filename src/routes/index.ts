import { Router } from "express";
import UserRoutes from "./UserRoutes";
import RoomRoutes from "./RoomRoutes";

const router = Router();

router.use("/users", UserRoutes);
router.use("/rooms", RoomRoutes)

export default router;