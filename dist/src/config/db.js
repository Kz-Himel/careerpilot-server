import dotenv from "dotenv";
dotenv.config();
import { MongoClient, ServerApiVersion } from "mongodb";
const uri = process.env.MONGODB_URI;
if (!uri) {
    throw new Error("MONGODB_URI is missing in .env");
}
const globalWithMongo = globalThis;
if (!globalWithMongo._mongoClient) {
    globalWithMongo._mongoClient = new MongoClient(uri, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        },
        // সার্ভারলেস রিকোয়েস্টের জন্য অপ্টিমাইজড টাইমআউট সেটিং
        connectTimeoutMS: 10000,
        socketTimeoutMS: 30000,
    });
    globalWithMongo._mongoDb = globalWithMongo._mongoClient.db(process.env.DATABASE_NAME);
}
// 🌟 আপনার অন্য সব ফাইলের ইম্পোর্ট ঠিক রাখার জন্য সরাসরি `db` অবজেক্ট এক্সপোর্ট
export const db = globalWithMongo._mongoDb;
const client = globalWithMongo._mongoClient;
// 🌟 আপনার এন্ট্রি পয়েন্ট ফাইলের জন্য connectDB ফাংশন
export async function connectDB() {
    // যদি অলরেডি ইন্টারনালি কানেক্টেড থাকে, তবে এটি দ্রুত স্কিপ করবে
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("MongoDB Connected Successfully");
}
