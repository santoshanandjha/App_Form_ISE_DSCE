import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

const connection = async () => {
    try {
        const con = await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000
        });
        console.log("✅ Successfully connected to Primary MongoDB:", con.connection.host);
    } catch (err) {
        console.error("⚠️ Primary MongoDB connection failed:", err.message);
        console.log("🚀 Starting In-Memory MongoDB Fallback Database...");
        try {
            const mongoServer = await MongoMemoryServer.create();
            const memoryUri = mongoServer.getUri();
            const con = await mongoose.connect(memoryUri);
            console.log("🎉 Successfully connected to In-Memory MongoDB Database:", con.connection.host);
        } catch (fallbackErr) {
            console.error("❌ Fallback Database connection error:", fallbackErr.message);
        }
    }
}
export default connection;