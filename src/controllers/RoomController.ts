import Room from "../models/Room";
import { Request, Response } from "express";

const getAllRooms = async (req: Request, res: Response) => {
  try {
    const rooms = await Room.find();
    res.status(200).json(rooms);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching rooms",
      error,
    });
  }
};

const getRoomById = async (req: Request, res: Response) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }
    res.status(200).json(room);
  } catch (error) {
    res.status(500).json({ message: "Error fetching Room", error });
  }
};

const createRoom = async (req: Request, res: Response) => {
  try {
    let {
      name,
      users,
      description,
      createdAt,
      createdBy,
      max_players,
      isPrivate,
      password,
      serverIP,
      serverPort,
    } = req.body;

    if (isPrivate == false) {
      password = null;
    }

    const room = new Room({
      name,
      users,
      description,
      createdAt,
      createdBy,
      max_players,
      isPrivate,
      password,
      serverIP,
      serverPort,
    });

    await room.save();

    res.status(201).json({ message: "Room created", room });
  } catch (error) {
    res.status(500).json({ message: "Error creating user", error });
  }
};

const updateRoom = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    let { name, users, description, max_players, isPrivate, password } =
      req.params;

    const room = await Room.findByIdAndUpdate(
      id,
      { name, users, description, max_players, isPrivate, password },
      { new: true }
    );

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    res.status(200).json({ message: "Error updating room", room });
  } catch (error) {
    res.status(500).json({ message: "Error updating Room", error });
  }
};

const hardDeleteRoom = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const room = await Room.findByIdAndDelete(id);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }
    res.status(200).json({ message: "Room hard deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error hard deleting room", error });
  }
};


export default { getAllRooms, getRoomById, createRoom, updateRoom, hardDeleteRoom };
