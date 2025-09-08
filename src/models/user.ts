import mongoose, { Schema, Model } from "mongoose";
import type { IUser } from "../interfaces/IUser";

const userSchema = new Schema<IUser>(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true },
    isActive: { type: Number, default: 1 }, // 1 for active, 0 for inactive (soft delete)
  },
  { timestamps: true, versionKey: false }
);

const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);
export default User;
