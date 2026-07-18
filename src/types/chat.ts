// src/types/chat.ts
import type { ObjectId } from "mongodb";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface ChatHistoryDocument {
  _id?: ObjectId;
  userEmail: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}