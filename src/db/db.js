import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

async function connectDB() {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 50000, // Increase timeout to 50 seconds
    });
    console.log("Database connected successfully");
  } catch (error) {
    console.log("Error in connecting database: ", error);
  }
}

export default connectDB;
