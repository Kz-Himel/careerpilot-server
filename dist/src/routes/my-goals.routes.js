"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_js_1 = require("../config/db.js");
const verifyToken_js_1 = require("../middleware/verifyToken.js");
const router = (0, express_1.Router)();
const goalsCollection = db_js_1.db.collection("careerGoals");
// Get Logged-in User Goals
router.get("/my", verifyToken_js_1.verifyToken, async (req, res) => {
    try {
        const activeUser = req.user;
        if (!activeUser?.email) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized User",
            });
        }
        const goals = await goalsCollection
            .find({
            userEmail: activeUser.email,
        })
            .sort({
            createdAt: -1,
        })
            .toArray();
        return res.status(200).json({
            success: true,
            message: "Your goals fetched successfully",
            total: goals.length,
            data: goals,
        });
    }
    catch (error) {
        console.error("Get My Goals Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch your goals",
        });
    }
});
exports.default = router;
