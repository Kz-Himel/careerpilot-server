import { MongoClient, Db } from "mongodb";

let client: MongoClient;
let db: Db | null = null;


export async function connectDB() {

    if (db) {
        return db;
    }


    const uri = process.env.MONGODB_URI;

    const dbName = process.env.DB_NAME;


    if (!uri) {
        throw new Error("MONGODB_URI is missing");
    }

    if (!dbName) {
        throw new Error("DB_NAME is missing");
    }


    client = new MongoClient(uri);

    await client.connect();


    db = client.db(dbName);


    console.log("MongoDB Connected");


    return db;
}


export { db };