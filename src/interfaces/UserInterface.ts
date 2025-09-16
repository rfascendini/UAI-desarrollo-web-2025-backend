import { Document } from "mongoose";

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  isActive: number; // 1 for active, 0 for inactive
  firebaseUID: string;
}