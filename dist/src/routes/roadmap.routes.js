"use strict";
// // routes/roadmap.routes.ts
// import { Router, Request, Response } from "express";
// import { ObjectId } from "mongodb";
// import { db } from "../config/db";
// import { verifyToken } from "../middleware/verifyToken";
// import { groq, AI_MODEL } from "../utils/ai";
Object.defineProperty(exports, "__esModule", { value: true });
// const router = Router();
// const ROADMAP_SYSTEM_PROMPT = `You are an expert career roadmap generator for CareerPilot AI.
// Generate a structured learning roadmap based on the user's input.
// Respond ONLY in valid JSON format, no markdown, no extra text. Follow this exact schema:
// {
//   "targetRole": string,
//   "durationMonths": number,
//   "months": [
//     {
//       "monthNumber": number,
//       "title": string,
//       "topics": string[]
//     }
//   ]
// }`;
// // POST /generate - AI generates roadmap (not saved yet)
// router.post("/generate", verifyToken, async (req: Request, res: Response) => {
//   try {
//     const { currentRole, targetRole, currentSkills, weeklyStudyHours, experienceLevel } = req.body;
//     if (!targetRole || !experienceLevel) {
//       return res.status(400).json({
//         success: false,
//         message: "Target role and experience level are required.",
//       });
//     }
//     const userPrompt = `Generate a career roadmap for:
// - Current role: ${currentRole || "Not specified"}
// - Target role: ${targetRole}
// - Current skills: ${currentSkills?.join(", ") || "None"}
// - Weekly study hours: ${weeklyStudyHours || 10}
// - Experience level: ${experienceLevel}
// Create a 3-6 month roadmap with weekly milestones. Return ONLY the JSON object, nothing else.`;
//     const completion = await groq.chat.completions.create({
//       model: AI_MODEL,
//       messages: [
//         { role: "system", content: ROADMAP_SYSTEM_PROMPT },
//         { role: "user", content: userPrompt },
//       ],
//       temperature: 0.6,
//       max_tokens: 1500,
//     });
//     const rawText = completion.choices[0]?.message?.content?.trim() ?? "";
//     // Strip markdown code fences if present
//     const cleanText = rawText.replace(/```json|```/g, "").trim();
//     let roadmapData;
//     try {
//       roadmapData = JSON.parse(cleanText);
//     } catch (parseErr) {
//       console.error("Roadmap JSON parse failed:", cleanText);
//       return res.status(500).json({
//         success: false,
//         message: "AI returned invalid format. Please try again.",
//       });
//     }
//     return res.status(200).json({
//       success: true,
//       data: roadmapData,
//     });
//   } catch (error) {
//     console.error("Roadmap Generate Error:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Failed to generate roadmap.",
//     });
//   }
// });
// // POST / - save generated roadmap
// router.post("/", verifyToken, async (req: Request, res: Response) => {
//   try {
//     const activeUser = (req as any).user;
//     const { targetRole, durationMonths, months } = req.body;
//     if (!targetRole || !months) {
//       return res.status(400).json({
//         success: false,
//         message: "Roadmap data is incomplete.",
//       });
//     }
//     const result = await db.collection("roadmaps").insertOne({
//       userEmail: activeUser.email,
//       targetRole,
//       durationMonths,
//       months,
//       progress: 0,
//       generatedAt: new Date(),
//     });
//     return res.status(201).json({
//       success: true,
//       message: "Roadmap saved successfully.",
//       insertedId: result.insertedId,
//     });
//   } catch (error) {
//     console.error("Save Roadmap Error:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Failed to save roadmap.",
//     });
//   }
// });
// // GET / - list user's saved roadmaps
// router.get("/", verifyToken, async (req: Request, res: Response) => {
//   try {
//     const activeUser = (req as any).user;
//     const roadmaps = await db
//       .collection("roadmaps")
//       .find({ userEmail: activeUser.email })
//       .sort({ generatedAt: -1 })
//       .toArray();
//     return res.status(200).json({
//       success: true,
//       data: roadmaps,
//     });
//   } catch (error) {
//     console.error("Fetch Roadmaps Error:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Failed to fetch roadmaps.",
//     });
//   }
// });
// // GET /:id - single roadmap detail
// router.get("/:id", verifyToken, async (req: Request, res: Response) => {
//   try {
//     const id = req.params.id as string;
//     if (!ObjectId.isValid(id)) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid Roadmap ID",
//       });
//     }
//     const roadmap = await db.collection("roadmaps").findOne({ _id: new ObjectId(id) });
//     if (!roadmap) {
//       return res.status(404).json({
//         success: false,
//         message: "Roadmap not found",
//       });
//     }
//     return res.status(200).json({
//       success: true,
//       data: roadmap,
//     });
//   } catch (error) {
//     console.error("Single Roadmap Error:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Failed to fetch roadmap.",
//     });
//   }
// });
// // DELETE /:id - delete roadmap
// router.delete("/:id", verifyToken, async (req: Request, res: Response) => {
//   try {
//     const activeUser = (req as any).user;
//     const id = req.params.id as string;
//     if (!ObjectId.isValid(id)) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid Roadmap ID",
//       });
//     }
//     const roadmap = await db.collection("roadmaps").findOne({ _id: new ObjectId(id) });
//     if (!roadmap) {
//       return res.status(404).json({ success: false, message: "Roadmap not found." });
//     }
//     if (roadmap.userEmail !== activeUser.email) {
//       return res.status(403).json({ success: false, message: "Not allowed to delete this roadmap." });
//     }
//     await db.collection("roadmaps").deleteOne({ _id: new ObjectId(id) });
//     return res.status(200).json({
//       success: true,
//       message: "Roadmap deleted successfully.",
//     });
//   } catch (error) {
//     console.error("Delete Roadmap Error:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Failed to delete roadmap.",
//     });
//   }
// });
// export default router;
// routes/roadmap.routes.ts
const express_1 = require("express");
const mongodb_1 = require("mongodb");
const db_1 = require("../config/db");
const verifyToken_1 = require("../middleware/verifyToken");
const ai_1 = require("../utils/ai");
const router = (0, express_1.Router)();
const ROADMAP_SYSTEM_PROMPT = `You are an expert career roadmap generator for CareerPilot AI.
Generate a structured learning roadmap based on the user's input.
Respond ONLY in valid JSON format, no markdown, no extra text. Follow this exact schema:

{
  "targetRole": string,
  "durationMonths": number,
  "months": [
    {
      "monthNumber": number,
      "title": string,
      "topics": string[]
    }
  ]
}`;
// POST /generate - AI generates roadmap (not saved yet)
router.post("/generate", verifyToken_1.verifyToken, async (req, res) => {
    try {
        const { currentRole, targetRole, currentSkills, weeklyStudyHours, experienceLevel, savedGuideId } = req.body;
        if (!targetRole || !experienceLevel) {
            return res.status(400).json({
                success: false,
                message: "Target role and experience level are required.",
            });
        }
        // Optional field: savedGuideId validation and database check
        let referenceContext = "";
        if (savedGuideId) {
            if (mongodb_1.ObjectId.isValid(savedGuideId)) {
                const savedGuide = await db_1.db.collection("savedGoals").findOne({ _id: new mongodb_1.ObjectId(savedGuideId) });
                if (savedGuide) {
                    referenceContext = `\nReference guide the user saved for inspiration:
Role: ${savedGuide.title}
Required Skills: ${savedGuide.requiredSkills?.join(", ") || "None"}
Salary Range: ${savedGuide.salaryRange || "Not specified"}
Estimated Time: ${savedGuide.estimatedTime || "Not specified"}
Use this as helpful context but still personalize the roadmap to the user's own inputs above.`;
                }
            }
            else {
                console.warn("Invalid savedGuideId format received:", savedGuideId);
            }
        }
        const userPrompt = `Generate a career roadmap for:
- Current role: ${currentRole || "Not specified"}
- Target role: ${targetRole}
- Current skills: ${currentSkills?.join(", ") || "None"}
- Weekly study hours: ${weeklyStudyHours || 10}
- Experience level: ${experienceLevel}
${referenceContext}

Create a 3-6 month roadmap with weekly milestones. Return ONLY the JSON object, nothing else.`;
        const completion = await ai_1.groq.chat.completions.create({
            model: ai_1.AI_MODEL,
            messages: [
                { role: "system", content: ROADMAP_SYSTEM_PROMPT },
                { role: "user", content: userPrompt },
            ],
            temperature: 0.6,
            max_tokens: 1500,
        });
        const rawText = completion.choices[0]?.message?.content?.trim() ?? "";
        // Strip markdown code fences if present
        const cleanText = rawText.replace(/```json|```/g, "").trim();
        let roadmapData;
        try {
            roadmapData = JSON.parse(cleanText);
        }
        catch (parseErr) {
            console.error("Roadmap JSON parse failed:", cleanText);
            return res.status(500).json({
                success: false,
                message: "AI returned invalid format. Please try again.",
            });
        }
        return res.status(200).json({
            success: true,
            data: roadmapData,
        });
    }
    catch (error) {
        console.error("Roadmap Generate Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to generate roadmap.",
        });
    }
});
// POST / - save generated roadmap
router.post("/", verifyToken_1.verifyToken, async (req, res) => {
    try {
        const activeUser = req.user;
        const { targetRole, durationMonths, months } = req.body;
        if (!targetRole || !months) {
            return res.status(400).json({
                success: false,
                message: "Roadmap data is incomplete.",
            });
        }
        const result = await db_1.db.collection("roadmaps").insertOne({
            userEmail: activeUser.email,
            targetRole,
            durationMonths,
            months,
            progress: 0,
            generatedAt: new Date(),
        });
        return res.status(201).json({
            success: true,
            message: "Roadmap saved successfully.",
            insertedId: result.insertedId,
        });
    }
    catch (error) {
        console.error("Save Roadmap Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to save roadmap.",
        });
    }
});
// GET / - list user's saved roadmaps
router.get("/", verifyToken_1.verifyToken, async (req, res) => {
    try {
        const activeUser = req.user;
        const roadmaps = await db_1.db
            .collection("roadmaps")
            .find({ userEmail: activeUser.email })
            .sort({ generatedAt: -1 })
            .toArray();
        return res.status(200).json({
            success: true,
            data: roadmaps,
        });
    }
    catch (error) {
        console.error("Fetch Roadmaps Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch roadmaps.",
        });
    }
});
// GET /:id - single roadmap detail
router.get("/:id", verifyToken_1.verifyToken, async (req, res) => {
    try {
        const id = req.params.id;
        if (!mongodb_1.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Roadmap ID",
            });
        }
        const roadmap = await db_1.db.collection("roadmaps").findOne({ _id: new mongodb_1.ObjectId(id) });
        if (!roadmap) {
            return res.status(404).json({
                success: false,
                message: "Roadmap not found",
            });
        }
        return res.status(200).json({
            success: true,
            data: roadmap,
        });
    }
    catch (error) {
        console.error("Single Roadmap Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch roadmap.",
        });
    }
});
// DELETE /:id - delete roadmap
router.delete("/:id", verifyToken_1.verifyToken, async (req, res) => {
    try {
        const activeUser = req.user;
        const id = req.params.id;
        if (!mongodb_1.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Roadmap ID",
            });
        }
        const roadmap = await db_1.db.collection("roadmaps").findOne({ _id: new mongodb_1.ObjectId(id) });
        if (!roadmap) {
            return res.status(404).json({ success: false, message: "Roadmap not found." });
        }
        if (roadmap.userEmail !== activeUser.email) {
            return res.status(403).json({ success: false, message: "Not allowed to delete this roadmap." });
        }
        await db_1.db.collection("roadmaps").deleteOne({ _id: new mongodb_1.ObjectId(id) });
        return res.status(200).json({
            success: true,
            message: "Roadmap deleted successfully.",
        });
    }
    catch (error) {
        console.error("Delete Roadmap Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to delete roadmap.",
        });
    }
});
exports.default = router;
