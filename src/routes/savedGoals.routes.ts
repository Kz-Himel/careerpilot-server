// routes/savedGoals.routes.ts
import { Router, Request, Response } from "express";
import { ObjectId } from "mongodb";
import { db } from "../config/db";
import { verifyToken } from "../middleware/verifyToken";

const router = Router();

// POST /save/:goalId - save someone's career guide
router.post("/save/:goalId", verifyToken, async (req: Request, res: Response) => {
  try {
    const activeUser = req.user;
    const goalId = req.params.goalId as string;

    if (!activeUser?.email) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    if (!ObjectId.isValid(goalId)) {
      return res.status(400).json({ success: false, message: "Invalid Guide ID" });
    }

    const originalGuide = await db.collection("careerGoals").findOne({ _id: new ObjectId(goalId) });
    if (!originalGuide) {
      return res.status(404).json({ success: false, message: "Career guide not found" });
    }

    const alreadySaved = await db.collection("savedGoals").findOne({
      userEmail: activeUser.email,
      originalGoalId: goalId,
    });

    if (alreadySaved) {
      return res.status(409).json({ success: false, message: "Already saved to your list." });
    }

    const result = await db.collection("savedGoals").insertOne({
      userEmail: activeUser.email,
      originalGoalId: goalId,
      title: originalGuide.title,
      description: originalGuide.description,
      requiredSkills: originalGuide.requiredSkills ?? [],
      salaryRange: originalGuide.salaryRange,
      estimatedTime: originalGuide.estimatedTime,
      savedAt: new Date(),
    });

    return res.status(201).json({
      success: true,
      message: "Career guide saved successfully.",
      insertedId: result.insertedId,
    });
  } catch (error) {
    console.error("Save Guide Error:", error);
    return res.status(500).json({ success: false, message: "Failed to save career guide." });
  }
});

// GET /saved - list current user's saved guides
router.get("/saved", verifyToken, async (req: Request, res: Response) => {
  try {
    const activeUser = req.user;
    if (!activeUser?.email) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const saved = await db
      .collection("savedGoals")
      .find({ userEmail: activeUser.email })
      .sort({ savedAt: -1 })
      .toArray();

    return res.status(200).json({ success: true, data: saved });
  } catch (error) {
    console.error("Fetch Saved Guides Error:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch saved guides." });
  }
});

// DELETE /saved/:id - unsave (remove from saved list)
router.delete("/saved/:id", verifyToken, async (req: Request, res: Response) => {
  try {
    const activeUser = req.user;
    const id = req.params.id as string;

    if (!activeUser?.email) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid ID" });
    }

    const result = await db.collection("savedGoals").deleteOne({
      _id: new ObjectId(id),
      userEmail: activeUser.email,
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ success: false, message: "Saved guide not found." });
    }

    return res.status(200).json({ success: true, message: "Removed from saved list." });
  } catch (error) {
    console.error("Unsave Guide Error:", error);
    return res.status(500).json({ success: false, message: "Failed to remove saved guide." });
  }
});

export default router;