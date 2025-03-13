import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

async function connectDB() {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
    const connectionInstance = console.log("data base connected sucessful");
  } catch (error) {
    console.log("Error in connecting database: ", error);
  }
}

export default connectDB;
 