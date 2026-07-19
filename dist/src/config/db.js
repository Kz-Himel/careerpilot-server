"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
exports.connectDB = connectDB;
const mongodb_1 = require("mongodb");
const client = new mongodb_1.MongoClient(process.env.MONGODB_URI);
let db;
async function connectDB() {
    if (!db) {
        await client.connect();
        exports.db = db = client.db(process.env.DB_NAME);
        console.log("MongoDB Connected");
    }
    return db;
}
