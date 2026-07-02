import mongoose, { Schema, Model } from "mongoose";
import type { IUser } from "../interfaces/UserInterface.js";

const userSchema = new Schema<IUser>(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    username: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    isActive: { type: Number, default: 1 },
    firebaseUID: { type: String, required: true, unique: true },
  },
  { timestamps: true, versionKey: false }
);

userSchema.index({ username: 1 }, { unique: true, collation: { locale: "en", strength: 2 } });

const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);
export default User;
