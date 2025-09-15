import { Document } from "mongoose";
import type { IUser } from "./UserInterface";

export interface IRoom extends Document {
  name: String;
  users: IUser[]; 
  description: String;
  createdAt: Date;
  createdBy: IUser;
  max_players: Number,
  isPrivate: Boolean,
  password: String,
  serverIP: String,
  serverPort: Number,
  isDeleted: Boolean
}