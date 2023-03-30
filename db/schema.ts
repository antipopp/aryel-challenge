import mongoose, { Document } from "mongoose";

// Define interface for MemoryGameResult document
interface IMemoryGameResult extends Document {
  nickname: string;
  time: number;
  createdAt: Date;
}

// Define MemoryGameResult schema
const MemoryGameResultSchema = new mongoose.Schema<IMemoryGameResult>({
  nickname: {
    type: String,
    required: true,
    unique: true,
  },
  time: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create and export MemoryGameResult model
export const MemoryGameResult = mongoose.model<IMemoryGameResult>(
  "MemoryGameResult",
  MemoryGameResultSchema
);
