import { MongoClient } from "mongodb";
const client = new MongoClient(process.env.MONGODB_URI);
let database = null;
export async function connectDB() {
    if (database)
        return database;
    await client.connect();
    database = client.db(process.env.DB_NAME);
    console.log("MongoDB Connected");
    return database;
}
export const db = new Proxy({}, {
    get(_target, prop) {
        if (!database) {
            throw new Error("Database not connected yet");
        }
        return database[prop];
    }
});
