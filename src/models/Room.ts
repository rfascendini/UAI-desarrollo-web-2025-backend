import { Schema, model } from "mongoose";
import type { IRoom } from "../interfaces/IInterface";

const roomSchema = new Schema<IRoom>(
  {
    roomName: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    users: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Room = model<IRoom>("Room", roomSchema);
export default Room;
