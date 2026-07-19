"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AI_MODEL = exports.groq = void 0;
// utils/ai.ts
const groq_sdk_1 = __importDefault(require("groq-sdk"));
if (!process.env.GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY is not defined in environment variables");
}
exports.groq = new groq_sdk_1.default({
    apiKey: process.env.GROQ_API_KEY,
});
exports.AI_MODEL = "llama-3.3-70b-versatile";
