import { MongoClient, Db } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI!);

let db: Db;

export async function connectDB() {
    if (!db) {
        await client.connect();
        db = client.db(process.env.DB_NAME);
        console.log("MongoDB Connected");
    }

    return db;
}

export { db };