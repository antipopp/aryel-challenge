"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemoryGameResult = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
// Define MemoryGameResult schema
const MemoryGameResultSchema = new mongoose_1.default.Schema({
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
exports.MemoryGameResult = mongoose_1.default.model("MemoryGameResult", MemoryGameResultSchema);
