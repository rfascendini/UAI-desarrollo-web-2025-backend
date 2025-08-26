import { Document, Types } from "mongoose";
import type { IUser } from "./IUser";

export interface IRoom extends Document {
  roomName: string;
  users: IUser[]; 
  description: string;
  createdAt: Date;
  createdBy: IUser;
}