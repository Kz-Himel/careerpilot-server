import "dotenv/config";

import app from "../src/app.js";
import { connectDB } from "../src/config/db.js";

export default async function handler(
    req: any,
    res: any
) {
    try {
        // প্রতি রিকোয়েস্টে রান হবে। কানেকশন লাইভ থাকলে ১ মিলি-সেকেন্ডও লাগবে না।
        // আর কানেকশন ড্রপ করলে অটোমেটিক রিকানেক্ট (Self-Healing) করবে।
        await connectDB();

        // আপনার মেইন অ্যাপ বা এক্সপ্রেস হ্যান্ডলার রান করা হচ্ছে
        return app(req, res);

    } catch (error) {
        // Vercel Dashboard Logs-এ যেন আসল সমস্যা দেখতে পারেন
        console.error("Vercel Core Handler Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            details: error instanceof Error ? error.message : "Unknown error"
        });
    }
}