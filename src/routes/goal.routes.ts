import { Router, Response, Request } from "express";
import { ObjectId } from "mongodb";
import { db } from "../config/db";
import { verifyToken } from "../middleware/verifyToken";

const router = Router();

// Create Goal (Protected)
router.post("/", verifyToken, async (req: Request, res: Response) => {
  try {
    const activeUser = req.user;

    if (!activeUser?.email) {
      return res.status(401).json({
        success: false,
        message: "User information missing",
      });
    }

    const bodyData = req.body;

    const goal = {
      ...bodyData,
      userEmail: activeUser.email,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection("careerGoals").insertOne(goal);

    return res.status(201).json({
      success: true,
      message: "Goal created successfully.",
      insertedId: result.insertedId,
    });
  } catch (error) {
    console.error("Create Goal Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create goal.",
    });
  }
});

// Get All Goals
router.get("/", async (req: Request, res: Response) => {
  try {
    const goals = await db
      .collection("careerGoals")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();


    return res.status(200).json({
      success: true,
      message: "Goals fetched successfully",
      total: goals.length,
      data: goals,
    });

  } catch (error) {
    console.error("Get Goals Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch goals",
    });
  }
});

// Get Single Goal
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    // MongoDB ObjectId validation
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Goal ID",
      });
    }


    const goal = await db.collection("careerGoals").findOne({
      _id: new ObjectId(id),
    });


    if (!goal) {
      return res.status(404).json({
        success: false,
        message: "Goal not found",
      });
    }


    return res.status(200).json({
      success: true,
      message: "Goal fetched successfully",
      data: goal,
    });


  } catch (error) {
    console.error("Single Goal Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch goal",
    });
  }
});

// Update Goal (Protected)
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
        message: "Invalid Goal ID format.",
      });
    }

    const goal = await db.collection("careerGoals").findOne({
      _id: new ObjectId(id),
    });

    if (!goal) {
      return res.status(404).json({
        success: false,
        message: "Goal not found.",
      });
    }


    if (goal.userEmail !== activeUser.email) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to update this goal.",
      });
    }


    const result = await db.collection("careerGoals").updateOne(
      {
        _id: new ObjectId(id),
      },
      {
        $set: {
          ...req.body,
          updatedAt: new Date(),
        },
      }
    );


    return res.status(200).json({
      success: true,
      message: "Goal updated successfully.",
      modifiedCount: result.modifiedCount,
    });


  } catch (error) {
    console.error("Update Goal Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update goal.",
    });
  }
});


// // Delete Goal (Protected)
// router.delete("/:id", verifyToken, async (req: Request, res: Response) => {
//   try {
//     const id = req.params.id;
//     const activeUser = req.user;


//     if (!activeUser?.email) {
//       return res.status(401).json({
//         success: false,
//         message: "Unauthorized",
//       });
//     }


//     if (!ObjectId.isValid(id)) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid Goal ID format.",
//       });
//     }


//     const goal = await db.collection("careerGoals").findOne({
//       _id: new ObjectId(id),
//     });


//     if (!goal) {
//       return res.status(404).json({
//         success: false,
//         message: "Goal not found.",
//       });
//     }


//     if (goal.userEmail !== activeUser.email) {
//       return res.status(403).json({
//         success: false,
//         message: "You are not allowed to delete this goal.",
//       });
//     }


//     const result = await db.collection("careerGoals").deleteOne({
//       _id: new ObjectId(id),
//     });


//     return res.status(200).json({
//       success: true,
//       message: "Goal deleted successfully.",
//       deletedCount: result.deletedCount,
//     });


//   } catch (error) {
//     console.error("Delete Goal Error:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Failed to delete goal.",
//     });
//   }
// });


export default router;