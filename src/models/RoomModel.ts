import { Schema, model } from "mongoose";
import type { IRoom } from "../interfaces/RoomInterface";

const roomSchema = new Schema<IRoom>(
  {
    name: { type: String, required: true, trim: true },
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
    max_players: { type: Number, default: 10 },
    isPrivate: { type: Boolean, default: false },
    password: { type: String },
    serverIP: { type: String, required: true },
    serverPort: { type: Number, required: true },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true, versionKey: false
  }
);



const Room = model<IRoom>("Room", roomSchema);
export default Room;
