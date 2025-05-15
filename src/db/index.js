import mongoose from "mongoose";
import dotenv from "dotenv";
import { dbname } from "../constant.js";

dotenv.config(); // Load environment variables

const connectdb = async () => {
    try {
        // Use the full connection string from the .env file
        const connectionString = process.env.MONGO_URI;

        const connection = await mongoose.connect(connectionString, {
          
        });

        console.log(`✅ MongoDB Connected: ${connection.connection.host}`);
    } catch (error) {
        console.error("❌ MongoDB Connection Error:", error);
        process.exit(1);
    }
};

export default connectdb;
