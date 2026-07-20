import { MongoClient, Db } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI!);

let database: Db | null = null;


export async function connectDB() {

    if (database) return database;

    await client.connect();

    database = client.db(process.env.DB_NAME);

    console.log("MongoDB Connected");

    return database;
}


export const db = new Proxy({} as Db, {
    get(_target, prop) {

        if (!database) {
            throw new Error("Database not connected yet");
        }

        return database[prop as keyof Db];
    }
});