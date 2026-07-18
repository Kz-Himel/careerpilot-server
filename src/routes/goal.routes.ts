import { Router, Request, Response } from "express";
import verifyToken from "../middleware/verifyToken"; // পাথ ঠিক রেখো

const router = Router();

// গোল ক্রিয়েট করার রাউট (POST /goals)
router.post("/", verifyToken, async (req: Request, res: Response) => {
  try {
    // TypeScript-কে জানানোর জন্য যে req-এর ভেতর user আছে (as any) ব্যবহার করা হয়েছে
    const activeUser = (req as any).user;
    const bodyData = req.body;

    console.log("Authenticated User State:", activeUser);
    console.log("Received Action Payload:", bodyData);
    
    // এখানে তোমার ডাটাবেজে গোল সেভ করার মঙ্গুস লজিক লিখবে
    
    return res.status(200).json({
      success: true, // ফ্রন্টএন্ডে তোমার কোড 'data.success' চেক করে, তাই এটা মাস্ট
      message: "Goal processed successfully within secure tunnel boundary.",
      meta: {
        userId: activeUser?.sub || activeUser?.id,
        email: activeUser?.email
      },
      receivedData: bodyData
    });
    
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Internal core cluster operations execution failure.",
    });
  }
});

// Get Single Goal
router.get("/:id", async (req: Request, res: Response) => {
  // পরে করবে
  res.send("Get single goal");
});

// Update Goal
router.patch("/:id", async (req: Request, res: Response) => {
  // পরে করবে
  res.send("Update goal");
});

// Delete Goal
router.delete("/:id", async (req: Request, res: Response) => {
  // পরে করবে
  res.send("Delete goal");
});

export default router;