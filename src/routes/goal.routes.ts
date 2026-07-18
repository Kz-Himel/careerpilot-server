import { Router } from "express";
import { db } from "../config/db";

const router = Router();

// Create Goal
router.post("/", async (req, res) => {
  try {
    const goal = {
      ...req.body,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db
      .collection("careerGoals")
      .insertOne(goal);

    res.status(201).json({
      success: true,
      message: "Goal created successfully",
      insertedId: result.insertedId,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to create goal",
    });
  }
});

// Get All Goals
router.get("/", async (req, res) => {
  try {
    const goals = await db
      .collection("careerGoals")
      .find()
      .sort({ createdAt: -1 })
      .toArray();

    res.json({
      success: true,
      data: goals,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch goals",
    });
  }
});

// Get Single Goal
router.get("/:id", async (req, res) => {
  // পরে করবো
});

// Update Goal
router.patch("/:id", async (req, res) => {
  // পরে করবো
});

// Delete Goal
router.delete("/:id", async (req, res) => {
  // পরে করবো
});

export default router;