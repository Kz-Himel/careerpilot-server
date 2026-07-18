import { Router, Request, Response } from "express";
import { db } from "../config/db.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = Router();

const goalsCollection = db.collection("careerGoals");


// Get Logged-in User Goals
router.get("/my", verifyToken, async (req: Request, res: Response) => {
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


  } catch (error) {
    console.error("Get My Goals Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch your goals",
    });
  }
});


export default router;