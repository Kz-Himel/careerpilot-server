// routes/goal.routes.ts
import { Router, Response, Request } from "express";
import { ObjectId } from "mongodb";
import { db } from "../config/db.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = Router();

// Create Career Guide (Protected)
router.post("/", verifyToken, async (req: Request, res: Response) => {
  try {
    const activeUser = req.user;

    if (!activeUser?.email) {
      return res.status(401).json({
        success: false,
        message: "User information missing",
      });
    }

    const { title, description, requiredSkills, salaryRange, estimatedTime } = req.body;

    if (!title || !description || !salaryRange || !estimatedTime) {
      return res.status(400).json({
        success: false,
        message: "Title, description, salary range, and estimated time are required.",
      });
    }

    const guide = {
      title,
      description,
      requiredSkills: Array.isArray(requiredSkills) ? requiredSkills : [],
      salaryRange,
      estimatedTime,
      imageUrl: req.body.imageUrl || "",
      userEmail: activeUser.email,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection("careerGoals").insertOne(guide);

    return res.status(201).json({
      success: true,
      message: "Career guide created successfully.",
      insertedId: result.insertedId,
    });
  } catch (error) {
    console.error("Create Guide Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create career guide.",
    });
  }
});

// Get All Career Guides (Public - with search, filter, sort, pagination) 
router.get("/", async (req: Request, res: Response) => {
  try {
    const {
      search = "",
      requiredSkills = "",
      sort = "newest",
      page = "1",
      limit = "8",
    } = req.query as Record<string, string>;

    const query: any = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    if (requiredSkills) {
      query.requiredSkills = { $regex: requiredSkills, $options: "i" };
    }

    let sortQuery: any = { createdAt: -1 };
    if (sort === "oldest") sortQuery = { createdAt: 1 };

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 8;
    const skip = (pageNum - 1) * limitNum;

    const total = await db.collection("careerGoals").countDocuments(query);

    const guides = await db
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
      data: guides,
    });
  } catch (error) {
    console.error("Get Guides Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch career guides",
    });
  }
});

// GET /popular - top 4 guides for home page display
router.get("/popular", async (req: Request, res: Response) => {
  try {
    const guides = await db
      .collection("careerGoals")
      .find({})
      .sort({ createdAt: -1 })
      .limit(4)
      .toArray();

    return res.status(200).json({
      success: true,
      data: guides,
    });
  } catch (error) {
    console.error("Popular Guides Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch popular guides.",
    });
  }
});

// Get Single Career Guide (Public)
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Guide ID",
      });
    }

    const guide = await db.collection("careerGoals").findOne({
      _id: new ObjectId(id),
    });

    if (!guide) {
      return res.status(404).json({
        success: false,
        message: "Career guide not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Career guide fetched successfully",
      data: guide,
    });
  } catch (error) {
    console.error("Single Guide Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch career guide",
    });
  }
});

// Update Career Guide (Protected - owner only)
router.patch("/:id", verifyToken, async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const activeUser = req.user;

    if (!activeUser?.email) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Guide ID format.",
      });
    }

    const guide = await db.collection("careerGoals").findOne({
      _id: new ObjectId(id),
    });

    if (!guide) {
      return res.status(404).json({
        success: false,
        message: "Career guide not found.",
      });
    }

    if (guide.userEmail !== activeUser.email) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to update this career guide.",
      });
    }

    const { title, description, requiredSkills, salaryRange, estimatedTime, imageUrl } = req.body;

    const updateFields: any = { updatedAt: new Date() };
    if (title !== undefined) updateFields.title = title;
    if (description !== undefined) updateFields.description = description;
    if (requiredSkills !== undefined) updateFields.requiredSkills = requiredSkills;
    if (salaryRange !== undefined) updateFields.salaryRange = salaryRange;
    if (estimatedTime !== undefined) updateFields.estimatedTime = estimatedTime;
    if (imageUrl !== undefined) updateFields.imageUrl = imageUrl;

    const result = await db.collection("careerGoals").updateOne(
      { _id: new ObjectId(id) },
      { $set: updateFields }
    );

    return res.status(200).json({
      success: true,
      message: "Career guide updated successfully.",
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error("Update Guide Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update career guide.",
    });
  }
});

// Delete Career Guide (Protected - owner only)
router.delete("/:id", verifyToken, async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const activeUser = req.user;

    if (!activeUser?.email) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Guide ID format.",
      });
    }

    const guide = await db.collection("careerGoals").findOne({
      _id: new ObjectId(id),
    });

    if (!guide) {
      return res.status(404).json({
        success: false,
        message: "Career guide not found.",
      });
    }

    if (guide.userEmail !== activeUser.email) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to delete this career guide.",
      });
    }

    const result = await db.collection("careerGoals").deleteOne({
      _id: new ObjectId(id),
    });

    return res.status(200).json({
      success: true,
      message: "Career guide deleted successfully.",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error("Delete Guide Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete career guide.",
    });
  }
});

export default router;