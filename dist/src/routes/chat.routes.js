"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// routes/chat.routes.ts
const express_1 = require("express");
const db_1 = require("../config/db");
const verifyToken_1 = require("../middleware/verifyToken");
const ai_1 = require("../utils/ai");
const router = (0, express_1.Router)();
const SYSTEM_PROMPT = `You are the AI Career Coach inside CareerPilot AI, a career coaching platform.
You help users with career advice, skill development, job readiness, resume tips, and learning direction.
Keep responses concise, encouraging, and actionable. If asked something unrelated to careers/learning, gently redirect back to career topics.`;
// POST /message - send message, get AI reply, auto-save
router.post("/message", verifyToken_1.verifyToken, async (req, res) => {
    try {
        const activeUser = req.user;
        const { message } = req.body;
        if (!message || typeof message !== "string" || !message.trim()) {
            return res.status(400).json({
                success: false,
                message: "Message is required.",
            });
        }
        const chatCollection = db_1.db.collection("chatHistory");
        // Find or create the user's chat thread
        let chatDoc = await chatCollection.findOne({ userEmail: activeUser.email });
        const previousMessages = chatDoc?.messages ?? [];
        // Build conversation context for Groq (last 10 messages max)
        const recentHistory = previousMessages.slice(-10);
        const completion = await ai_1.groq.chat.completions.create({
            model: ai_1.AI_MODEL,
            messages: [
                { role: "system", content: SYSTEM_PROMPT },
                ...recentHistory.map((m) => ({
                    role: m.role === "user" ? "user" : "assistant",
                    content: m.content,
                })),
                { role: "user", content: message },
            ],
            temperature: 0.7,
            max_tokens: 500,
        });
        const aiReply = completion.choices[0]?.message?.content?.trim() ??
            "Sorry, I couldn't generate a response.";
        const userMsg = { role: "user", content: message, timestamp: new Date() };
        const assistantMsg = { role: "assistant", content: aiReply, timestamp: new Date() };
        if (chatDoc) {
            await chatCollection.updateOne({ _id: chatDoc._id }, {
                $push: { messages: { $each: [userMsg, assistantMsg] } },
                $set: { updatedAt: new Date() },
            });
        }
        else {
            await chatCollection.insertOne({
                userEmail: activeUser.email,
                messages: [userMsg, assistantMsg],
                createdAt: new Date(),
                updatedAt: new Date(),
            });
        }
        return res.status(200).json({
            success: true,
            data: {
                reply: aiReply,
                suggestedPrompts: [
                    "What should I learn next?",
                    "Am I ready for a job?",
                    "Improve my resume",
                ],
            },
        });
    }
    catch (error) {
        console.error("Chat Message Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to process chat message.",
        });
    }
});
// GET /history - get full conversation history
router.get("/history", verifyToken_1.verifyToken, async (req, res) => {
    try {
        const activeUser = req.user;
        const chatDoc = await db_1.db
            .collection("chatHistory")
            .findOne({ userEmail: activeUser.email });
        return res.status(200).json({
            success: true,
            data: chatDoc?.messages ?? [],
        });
    }
    catch (error) {
        console.error("Chat History Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch chat history.",
        });
    }
});
// DELETE /history - clear conversation
router.delete("/history", verifyToken_1.verifyToken, async (req, res) => {
    try {
        const activeUser = req.user;
        await db_1.db.collection("chatHistory").deleteOne({ userEmail: activeUser.email });
        return res.status(200).json({
            success: true,
            message: "Chat history cleared.",
        });
    }
    catch (error) {
        console.error("Clear Chat Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to clear chat history.",
        });
    }
});
exports.default = router;
