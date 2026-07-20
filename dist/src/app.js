"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const goal_routes_js_1 = __importDefault(require("./routes/goal.routes.js"));
const my_goals_routes_js_1 = __importDefault(require("./routes/my-goals.routes.js"));
const chat_routes_js_1 = __importDefault(require("./routes/chat.routes.js"));
const roadmap_routes_js_1 = __importDefault(require("./routes/roadmap.routes.js"));
const dashboard_routes_js_1 = __importDefault(require("./routes/dashboard.routes.js"));
const savedGoals_routes_js_1 = __importDefault(require("./routes/savedGoals.routes.js"));
const app = (0, express_1.default)();
const allowedOrigins = [
    "http://localhost:3000",
    process.env.CLIENT_URL
].filter((origin) => Boolean(origin));
app.use((0, cors_1.default)({
    origin: allowedOrigins,
    credentials: true
}));
app.use(express_1.default.json());
app.get("/", (_req, res) => {
    res.send("CareerPilot AI API Running 🚀");
});
// Production API Routes
app.use("/goals", my_goals_routes_js_1.default);
app.use("/goals", goal_routes_js_1.default);
app.use("/chat", chat_routes_js_1.default);
app.use("/roadmaps", roadmap_routes_js_1.default);
app.use("/dashboard", dashboard_routes_js_1.default);
app.use("/saved-goals", savedGoals_routes_js_1.default);
exports.default = app;
