import { Document } from "mongoose";
import type { IUser } from "./UserInterface";

export interface IRoomParticipant {
  user: IUser;
  position: number;
  joinedAt: Date;
}

export interface IRoom extends Document {
  name: string;
  users: IRoomParticipant[];
  description?: string;
  createdAt: Date;
  createdBy: IUser;
  max_players: number;
  isPrivate: boolean;
  roomPassword?: string;
  serverPassword?: string;
  serverIP: string;
  serverPort: number;
  isDeleted: boolean;
}
