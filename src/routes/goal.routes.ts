import { Router, Request, Response } from "express";
import { db } from "../config/db";
import verifyToken from "../middleware/verifyToken";

const router = Router();

// Create Goal
router.post("/", verifyToken, async (req: Request, res: Response) => {
  try {
    const activeUser = (req as any).user;
    const bodyData = req.body;

    const goal = {
      ...bodyData,
      userEmail: activeUser?.email,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db
      .collection("careerGoals")
      .insertOne(goal);

    return res.status(201).json({
      success: true,
      message: "Goal created successfully.",
      insertedId: result.insertedId,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to create goal.",
    });
  }
});

// Get All Goals (Public)
// Get All Goals (Public) - with search, filter, sort, pagination
router.get("/", async (req: Request, res: Response) => {
  try {
    const {
      search = "",
      priority = "",
      targetRole = "",
      sort = "newest",
      page = "1",
      limit = "8",
    } = req.query as Record<string, string>;

    const query: any = {};

    // Search (title or targetRole)
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { targetRole: { $regex: search, $options: "i" } },
      ];
    }

    // Filter field 1: priority
    if (priority) {
      query.priority = priority;
    }

    // Filter field 2: targetRole
    if (targetRole) {
      query.targetRole = { $regex: targetRole, $options: "i" };
    }

    // Sort
    let sortQuery: any = { createdAt: -1 }; // newest (default)
    if (sort === "oldest") sortQuery = { createdAt: 1 };
    if (sort === "priority") sortQuery = { priority: -1 };

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 8;
    const skip = (pageNum - 1) * limitNum;

    const total = await db.collection("careerGoals").countDocuments(query);

    const goals = await db
      .collection("careerGoals")
      .find(query)
      .sort(sortQuery)
      .skip(skip)
      .limit(limitNum)
      .toArray();

    return res.status(200).json({
      success: true,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
      data: goals,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch goals.",
    });
  }
});

// Get Single Goal
router.get("/:id", async (req: Request, res: Response) => {
  res.send("Get single goal");
});

// Update Goal
router.patch("/:id", async (req: Request, res: Response) => {
  res.send("Update goal");
});

// Delete Goal
router.delete("/:id", async (req: Request, res: Response) => {
  res.send("Delete goal");
});

export default router;