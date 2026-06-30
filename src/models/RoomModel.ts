import { Schema, model } from "mongoose";
import type { IRoom } from "../interfaces/RoomInterface";

const roomSchema = new Schema<IRoom>(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    users: [
      {
        user: { type: Schema.Types.ObjectId, ref: "User", required: true },
        position: { type: Number, required: true, min: 1, max: 10 },
        joinedAt: { type: Date, default: Date.now },
      },
    ],
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    max_players: { type: Number, default: 10, immutable: true },
    isPrivate: { type: Boolean, default: false },
    roomPassword: { type: String, select: false },
    serverPassword: { type: String, select: false },
    serverIP: { type: String, required: true },
    serverPort: { type: Number, required: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true, versionKey: false }
);

roomSchema.index({ isDeleted: 1, createdBy: 1 });
roomSchema.index({ isDeleted: 1, "users.user": 1 });
roomSchema.index({ _id: 1, "users.position": 1 });
roomSchema.index(
  { "users.user": 1 },
  { unique: true, partialFilterExpression: { isDeleted: false } }
);

const Room = model<IRoom>("Room", roomSchema);
export default Room;
