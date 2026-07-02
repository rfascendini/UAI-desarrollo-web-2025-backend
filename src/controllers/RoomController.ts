import bcrypt from "bcryptjs";
import type { Request, Response } from "express";
import { Types } from "mongoose";
import Room from "../models/RoomModel.js";

type PopulatedUser = {
  _id: Types.ObjectId;
  firstName: string;
  lastName: string;
  username: string;
};

type Participant = {
  user: PopulatedUser;
  position: number;
  joinedAt: Date;
};

type RoomView = {
  _id: Types.ObjectId;
  name: string;
  description?: string;
  users: Participant[];
  createdBy: PopulatedUser;
  max_players: number;
  isPrivate: boolean;
  serverIP?: string;
  serverPort?: number;
  serverPassword?: string;
  createdAt: Date;
  roomPassword?: string;
};

const roomPopulate = [
  { path: "createdBy", select: "firstName lastName username" },
  { path: "users.user", select: "firstName lastName username" },
];

const userSummary = (user: PopulatedUser) => ({
  id: String(user._id),
  firstName: user.firstName,
  lastName: user.lastName,
  username: user.username,
});

const serializeRoom = (room: RoomView, currentUserId?: string) => {
  const participants = room.users
    .filter((item) => item.user)
    .map((item) => ({
      user: userSummary(item.user),
      position: item.position,
      joinedAt: item.joinedAt,
    }))
    .sort((a, b) => a.position - b.position);

  const isMember = Boolean(currentUserId && participants.some((item) => item.user.id === currentUserId));
  const isHost = Boolean(currentUserId && String(room.createdBy._id) === currentUserId);
  return {
    id: String(room._id),
    name: room.name,
    description: room.description || "",
    isPrivate: room.isPrivate,
    playerCount: participants.length,
    max_players: 10,
    createdBy: userSummary(room.createdBy),
    users: participants,
    createdAt: room.createdAt,
    isMember,
    isHost,
    hasRoomPassword: room.isPrivate,
    hasServerPassword: Boolean(room.serverPassword),
    canEdit: isHost,
    connection:
      isMember
        ? {
            serverIP: room.serverIP,
            serverPort: room.serverPort,
            serverPassword: room.serverPassword || "",
            command: room.serverPassword
              ? `password "${room.serverPassword}"; connect ${room.serverIP}:${room.serverPort}`
              : `connect ${room.serverIP}:${room.serverPort}`,
            steamUrl: `steam://connect/${room.serverIP}:${room.serverPort}`,
          }
        : null,
  };
};

const findUserActiveRoom = (userId: Types.ObjectId) =>
  Room.findOne({ isDeleted: false, "users.user": userId }).select("_id createdBy");

const getAllRooms = async (req: Request, res: Response) => {
  const currentUserId = req.currentUser ? String(req.currentUser._id) : undefined;
  const rooms = await Room.find({ isDeleted: false })
    .select("+serverPassword")
    .populate(roomPopulate)
    .sort({ createdAt: -1 })
    .lean<RoomView[]>();

  const data = rooms
    .map((room) => serializeRoom(room, currentUserId))
    .sort((a, b) => Number(b.isMember) - Number(a.isMember));

  res.setHeader("Cache-Control", "no-store");
  return res.status(200).json({ rooms: data });
};

const getMyRoom = async (req: Request, res: Response) => {
  if (!req.currentUser) return res.status(401).json({ message: "Tenes que iniciar sesion." });
  const room = await Room.findOne({ isDeleted: false, "users.user": req.currentUser._id })
    .select("+serverPassword")
    .populate(roomPopulate)
    .lean<RoomView | null>();

  return res.status(200).json({ room: room ? serializeRoom(room, String(req.currentUser._id)) : null });
};

const createRoom = async (req: Request, res: Response) => {
  if (!req.currentUser) return res.status(401).json({ message: "Tenes que iniciar sesion." });

  const userId = req.currentUser._id as Types.ObjectId;
  const activeRoom = await findUserActiveRoom(userId);
  if (activeRoom) return res.status(409).json({ message: "Ya perteneces a una sala activa." });

  const roomPassword = req.body.isPrivate ? await bcrypt.hash(req.body.roomPassword, 10) : undefined;

  const room = await Room.create({
    name: req.body.name,
    description: req.body.description || "",
    users: [{ user: userId, position: 1 }],
    createdBy: userId,
    max_players: 10,
    isPrivate: Boolean(req.body.isPrivate),
    roomPassword,
    serverIP: req.body.serverIP,
    serverPort: req.body.serverPort,
    serverPassword: req.body.serverPassword || undefined,
    isDeleted: false,
  });

  const populated = await Room.findById(room._id).select("+serverPassword").populate(roomPopulate).lean<RoomView>();
  return res.status(201).json({ room: populated ? serializeRoom(populated, String(req.currentUser._id)) : null });
};

const updateRoom = async (req: Request, res: Response) => {
  if (!req.currentUser) return res.status(401).json({ message: "Tenes que iniciar sesion." });
  const room = await Room.findOne({ _id: req.params.id, isDeleted: false }).select("+roomPassword +serverPassword");
  if (!room) return res.status(404).json({ message: "Sala no encontrada." });
  if (String(room.createdBy) !== String(req.currentUser._id)) {
    return res.status(403).json({ message: "Solo el anfitrion puede editar la sala." });
  }

  if (req.body.name !== undefined) room.name = req.body.name;
  if (req.body.description !== undefined) room.description = req.body.description;
  if (req.body.serverIP !== undefined) room.serverIP = req.body.serverIP;
  if (req.body.serverPort !== undefined) room.serverPort = req.body.serverPort;
  if (req.body.removeServerPassword) room.serverPassword = undefined;
  if (req.body.serverPassword) room.serverPassword = req.body.serverPassword;

  if (req.body.isPrivate === false) {
    room.isPrivate = false;
    room.roomPassword = undefined;
  } else if (req.body.isPrivate === true) {
    room.isPrivate = true;
    if (req.body.roomPassword) room.roomPassword = await bcrypt.hash(req.body.roomPassword, 10);
    if (!room.roomPassword) return res.status(400).json({ message: "La sala privada necesita password." });
  } else if (req.body.roomPassword) {
    room.roomPassword = await bcrypt.hash(req.body.roomPassword, 10);
  }

  await room.save();
  const populated = await Room.findById(room._id).select("+serverPassword").populate(roomPopulate).lean<RoomView>();
  return res.status(200).json({ room: populated ? serializeRoom(populated, String(req.currentUser._id)) : null });
};

const joinRoom = async (req: Request, res: Response) => {
  if (!req.currentUser) return res.status(401).json({ message: "Tenes que iniciar sesion." });

  const userId = req.currentUser._id as Types.ObjectId;
  if (await findUserActiveRoom(userId)) {
    return res.status(409).json({ message: "Ya perteneces a una sala activa." });
  }

  const room = await Room.findOne({ _id: req.params.id, isDeleted: false }).select("+roomPassword");
  if (!room) return res.status(404).json({ message: "Sala no encontrada." });
  if (room.users.length >= 10) return res.status(409).json({ message: "La sala esta llena." });
  if (room.users.some((item) => item.position === req.body.position)) {
    return res.status(409).json({ message: "Esa posicion ya esta ocupada." });
  }
  if (room.isPrivate) {
    const ok = room.roomPassword && (await bcrypt.compare(req.body.roomPassword || "", room.roomPassword));
    if (!ok) return res.status(403).json({ message: "No se pudo entrar a la sala privada." });
  }

  const updated = await Room.findOneAndUpdate(
    {
      _id: req.params.id,
      isDeleted: false,
      "users.user": { $ne: userId },
      "users.position": { $ne: req.body.position },
      "users.9": { $exists: false },
    },
    { $push: { users: { user: userId, position: req.body.position, joinedAt: new Date() } } },
    { new: true }
  )
    .select("+serverPassword")
    .populate(roomPopulate)
    .lean<RoomView | null>();

  if (!updated) return res.status(409).json({ message: "La sala cambio. Actualiza e intenta de nuevo." });
  return res.status(200).json({ room: serializeRoom(updated, String(req.currentUser._id)) });
};

const leaveRoom = async (req: Request, res: Response) => {
  if (!req.currentUser) return res.status(401).json({ message: "Tenes que iniciar sesion." });
  const room = await Room.findOne({ _id: req.params.id, isDeleted: false, "users.user": req.currentUser._id });
  if (!room) return res.status(404).json({ message: "No perteneces a esa sala." });

  if (String(room.createdBy) === String(req.currentUser._id)) {
    room.isDeleted = true;
    await room.save();
    return res.status(200).json({ message: "Sala cerrada." });
  }

  await Room.updateOne({ _id: room._id }, { $pull: { users: { user: req.currentUser._id } } });
  return res.status(200).json({ message: "Saliste de la sala." });
};

const closeRoom = async (req: Request, res: Response) => {
  if (!req.currentUser) return res.status(401).json({ message: "Tenes que iniciar sesion." });
  const room = await Room.findOneAndUpdate(
    { _id: req.params.id, createdBy: req.currentUser._id, isDeleted: false },
    { $set: { isDeleted: true } },
    { new: true }
  );
  if (!room) return res.status(404).json({ message: "Sala no encontrada o sin permisos." });
  return res.status(200).json({ message: "Sala cerrada." });
};

const kickPlayer = async (req: Request, res: Response) => {
  if (!req.currentUser) return res.status(401).json({ message: "Tenes que iniciar sesion." });
  if (req.body.userId === String(req.currentUser._id)) {
    return res.status(400).json({ message: "No podes expulsarte como anfitrion." });
  }

  const updated = await Room.findOneAndUpdate(
    { _id: req.params.id, createdBy: req.currentUser._id, isDeleted: false, "users.user": req.body.userId },
    { $pull: { users: { user: req.body.userId } } },
    { new: true }
  )
    .select("+serverPassword")
    .populate(roomPopulate)
    .lean<RoomView | null>();

  if (!updated) return res.status(404).json({ message: "Jugador no encontrado o sin permisos." });
  return res.status(200).json({ room: serializeRoom(updated, String(req.currentUser._id)) });
};

const movePlayer = async (req: Request, res: Response) => {
  if (!req.currentUser) return res.status(401).json({ message: "Tenes que iniciar sesion." });
  const room = await Room.findOne({ _id: req.params.id, createdBy: req.currentUser._id, isDeleted: false });
  if (!room) return res.status(404).json({ message: "Sala no encontrada o sin permisos." });
  if (room.users.some((item) => item.position === req.body.position)) {
    return res.status(409).json({ message: "Esa posicion ya esta ocupada." });
  }

  const participant = room.users.find((item) => String(item.user) === req.body.userId);
  if (!participant) return res.status(404).json({ message: "Jugador no encontrado." });
  participant.position = req.body.position;
  await room.save();

  const populated = await Room.findById(room._id).select("+serverPassword").populate(roomPopulate).lean<RoomView>();
  return res.status(200).json({ room: populated ? serializeRoom(populated, String(req.currentUser._id)) : null });
};

const transferHost = async (req: Request, res: Response) => {
  if (!req.currentUser) return res.status(401).json({ message: "Tenes que iniciar sesion." });
  const room = await Room.findOne({ _id: req.params.id, createdBy: req.currentUser._id, isDeleted: false });
  if (!room) return res.status(404).json({ message: "Sala no encontrada o sin permisos." });
  if (!room.users.some((item) => String(item.user) === req.body.userId)) {
    return res.status(400).json({ message: "Solo podes transferir a un miembro actual." });
  }
  room.set("createdBy", new Types.ObjectId(req.body.userId));
  await room.save();

  const populated = await Room.findById(room._id).select("+serverPassword").populate(roomPopulate).lean<RoomView>();
  return res.status(200).json({ room: populated ? serializeRoom(populated, String(req.currentUser._id)) : null });
};

export default {
  getAllRooms,
  getMyRoom,
  createRoom,
  updateRoom,
  joinRoom,
  leaveRoom,
  closeRoom,
  kickPlayer,
  movePlayer,
  transferHost,
};
