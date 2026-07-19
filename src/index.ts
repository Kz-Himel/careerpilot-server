import "dotenv/config";

import app from "./app.js";
import { connectDB } from "./config/db.js";


const PORT = process.env.PORT || 5000;


async function startServer() {
    try {
        await connectDB();

        app.listen(PORT, () => {
            console.log(`Server running on ${PORT}`);
        });

    } catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
}


startServer();


// FOR LOCAL DEVELOPMENT

// import app from "./app";
// import { connectDB } from "./config/db";
// import goalRoutes from "./routes/goal.routes";
// import myGoalsRoutes from "./routes/my-goals.routes";
// import chatRoutes from "./routes/chat.routes";
// import roadmapRoutes from "./routes/roadmap.routes";
// import dashboardRoutes from "./routes/dashboard.routes";
// import savedGoalsRoutes from "./routes/savedGoals.routes";


// app.get("/", (_req, res) => {
//    res.send("CareerPilot AI Server Running... 🚀");
// });


// app.use("/goals", myGoalsRoutes);
// app.use("/goals", goalRoutes);
// app.use("/chat", chatRoutes);
// app.use("/roadmaps", roadmapRoutes);
// app.use("/dashboard", dashboardRoutes);
// app.use("/saved-goals", savedGoalsRoutes);


// const PORT = process.env.PORT || 5000;


// async function startServer() {
//    try {
//      await connectDB();

//      app.listen(PORT, () => {
//         console.log(`Server running on http://localhost:${PORT}`);
//      });

//    } catch (error) {
//      console.error("Failed to start server:", error);
//    }
// }


// startServer();