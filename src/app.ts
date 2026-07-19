import express from "express";
import cors from "cors";


const app = express();


const allowedOrigins = [
    "http://localhost:3000",
    process.env.CLIENT_URL
].filter((origin): origin is string => Boolean(origin));


app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));


app.use(express.json());


app.get("/", (req, res) => {
    res.send("API Running");
});


export default app;