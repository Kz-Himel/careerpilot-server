// utils/ai.ts
import Groq from "groq-sdk";
if (!process.env.GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY is not defined in environment variables");
}
export const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});
export const AI_MODEL = "llama-3.3-70b-versatile";
