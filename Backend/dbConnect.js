import mongoose from "mongoose";


const connection = async () => {
    try {
        const con = await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ Successfully connected to database:", con.connection.host);
    } catch (err) {
        console.error("⚠️ Failed to connect to database ERROR:", err.message);
        console.warn("⚠️ Server will keep running. Please verify MONGO_URI credentials.");
    }
}
export default connection