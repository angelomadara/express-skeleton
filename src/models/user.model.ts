import { Schema, model, Document } from "mongoose";
import { IUser } from "../types";

// ── Mongoose Document ──────────────────────────────
export interface UserDocument extends IUser, Document {}

// ── Schema ─────────────────────────────────────────
const userSchema = new Schema<UserDocument>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin", "user"], default: "user" },
  },
  { timestamps: true },
);

export default model<UserDocument>("User", userSchema);
