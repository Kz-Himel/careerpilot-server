// routes/dashboard.routes.ts
import { Router, Request, Response } from "express";
import { db } from "../config/db";
import { verifyToken } from "../middleware/verifyToken";

const router = Router();

// GET /stats - summary counts
router.get("/stats", verifyToken, async (req: Request, res: Response) => {
  try {
    const activeUser = (req as any).user;
    const userEmail = activeUser.email;

    const [totalGoals, roadmapsGenerated, chatDoc] = await Promise.all([
      db.collection("careerGoals").countDocuments({ userEmail }),
      db.collection("roadmaps").countDocuments({ userEmail }),
      db.collection("chatHistory").findOne({ userEmail }),
    ]);

    const aiConversations = chatDoc?.messages
      ? Math.ceil(chatDoc.messages.length / 2) // user+assistant pair = 1 exchange
      : 0;

    // "Skills Learned" - count unique skills across saved roadmaps' completed months (simple proxy)
    const roadmaps = await db.collection("roadmaps").find({ userEmail }).toArray();
    const skillsLearned = roadmaps.reduce((sum, r) => {
      const completedMonths = (r.months ?? []).filter((m: any) => m.status === "completed").length;
      return sum + completedMonths;
    }, 0);

    return res.status(200).json({
      success: true,
      data: {
        totalGoals,
        roadmapsGenerated,
        aiConversations,
        skillsLearned,
      },
    });
  } catch (error) {
    console.error("Dashboard Stats Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard stats.",
    });
  }
});

// GET /progress-overview - monthly progress for chart
router.get("/progress-overview", verifyToken, async (req: Request, res: Response) => {
  try {
    const activeUser = (req as any).user;
    const userEmail = activeUser.email;

    const goals = await db.collection("careerGoals").find({ userEmail }).toArray();

    // group by month of dueDate/createdAt, average currentProgress
    const monthMap: Record<string, { total: number; count: number }> = {};

    goals.forEach((goal) => {
      const date = new Date(goal.createdAt);
      const monthLabel = date.toLocaleDateString("en-US", { month: "short" });
      if (!monthMap[monthLabel]) monthMap[monthLabel] = { total: 0, count: 0 };
      monthMap[monthLabel].total += goal.currentProgress ?? 0;
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
  } catch (error) {
    console.error("Progress Overview Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch progress overview.",
    });
  }
});

export default router;