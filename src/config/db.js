import mongoose from "mongoose";
import { MONGO_URI } from "../utils/constants.js";

export const connectDB = async () => {
  try {
    await mongoose.set("strictQuery", false);
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
    });
    console.log(`MongoDB is connected`);
  } catch (err) {
    console.log(`MongoDB Error : ${err.message}`);
    // process.exit();
  }
};
