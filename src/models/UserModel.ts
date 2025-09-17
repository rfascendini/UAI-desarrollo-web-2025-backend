import mongoose, { Schema, Model } from "mongoose";
import type { IUser } from "../interfaces/UserInterface";

const userSchema = new Schema<IUser>(
  {
    firstName: { type: String, trim: true },
    lastName: { type: String, trim: true },
    email: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String }, // ⚠️ opcional porque lo maneja Firebase, pero guardo para cumplir Joi
    isActive: { type: Number, default: 1 }, // 1 activo, 0 inactivo
    firebaseUID: { type: String, unique: true },
  },
  { timestamps: true, versionKey: false }
);

const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);
export default User;
