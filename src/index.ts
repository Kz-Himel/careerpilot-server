import app from "./app";
import { connectDB } from "./config/db";
import goalRoutes from "./routes/goal.routes";
import myGoalsRoutes from "./routes/my-goals.routes";


app.get("/", (_req, res) => {
   res.send("CareerPilot AI Server Running... 🚀");
});


app.use("/goals", myGoalsRoutes);
app.use("/goals", goalRoutes);


const PORT = process.env.PORT || 5000;


async function startServer() {
   try {
     await connectDB();

     app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
     });

   } catch (error) {
     console.error("Failed to start server:", error);
   }
}


startServer();