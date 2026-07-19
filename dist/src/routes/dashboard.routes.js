"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// routes/dashboard.routes.ts
const express_1 = require("express");
const db_1 = require("../config/db");
const verifyToken_1 = require("../middleware/verifyToken");
const router = (0, express_1.Router)();
// GET /stats - summary counts
router.get("/stats", verifyToken_1.verifyToken, async (req, res) => {
    try {
        const activeUser = req.user;
        const userEmail = activeUser.email;
        const [totalGuides, roadmapsGenerated, chatDoc] = await Promise.all([
            db_1.db.collection("careerGoals").countDocuments({ userEmail }),
            db_1.db.collection("roadmaps").countDocuments({ userEmail }),
            db_1.db.collection("chatHistory").findOne({ userEmail }),
        ]);
        const aiConversations = chatDoc?.messages
            ? Math.ceil(chatDoc.messages.length / 2) // user+assistant pair = 1 exchange
            : 0;
        // "Skills Learned" - count completed months across saved roadmaps
        const roadmaps = await db_1.db.collection("roadmaps").find({ userEmail }).toArray();
        const skillsLearned = roadmaps.reduce((sum, r) => {
            const completedMonths = (r.months ?? []).filter((m) => m.status === "completed").length;
            return sum + completedMonths;
        }, 0);
        return res.status(200).json({
            success: true,
            data: {
                totalGuides,
                roadmapsGenerated,
                aiConversations,
                skillsLearned,
            },
        });
    }
    catch (error) {
        console.error("Dashboard Stats Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch dashboard stats.",
        });
    }
});
// GET /progress-overview - monthly roadmap progress for chart
router.get("/progress-overview", verifyToken_1.verifyToken, async (req, res) => {
    try {
        const activeUser = req.user;
        const userEmail = activeUser.email;
        // Progress is now tracked via saved Roadmaps (Goals/Guides no longer have a progress field)
        const roadmaps = await db_1.db.collection("roadmaps").find({ userEmail }).toArray();
        const monthMap = {};
        roadmaps.forEach((roadmap) => {
            const date = new Date(roadmap.generatedAt);
            const monthLabel = date.toLocaleDateString("en-US", { month: "short" });
            if (!monthMap[monthLabel])
                monthMap[monthLabel] = { total: 0, count: 0 };
            monthMap[monthLabel].total += roadmap.progress ?? 0;
            monthMap[monthLabel].count += 1;
        });
        const monthOrder = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const data = monthOrder
            .filter((m) => monthMap[m])
            .map((m) => ({
            month: m,
            progress: Math.round(monthMap[m].total / monthMap[m].count),
        }));
        return res.status(200).json({
            success: true,
            data,
        });
    }
    catch (error) {
        console.error("Progress Overview Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch progress overview.",
        });
    }
});
exports.default = router;
