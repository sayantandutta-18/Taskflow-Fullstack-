import mongoose from "mongoose";

const connectDB = async () => {
  console.log("connectDB called");
  console.log(process.env.MONGO_URI);

  try {
   const conn = await mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 10000,
  family: 4
});
   console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

export default connectDB;