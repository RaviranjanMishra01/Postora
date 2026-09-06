const mongoose = require("mongoose");
const seedInitialData = require("../utils/seedData");

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI || process.env.DBURI || "mongodb://127.0.0.1:27017/mern_blog";
    const conn = await mongoose.connect(uri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    // Seed initial data if DB is empty
    await seedInitialData();
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    // Don't terminate process in dev so app can still respond with mock/helpful errors if DB isn't running locally yet
  }
};

module.exports = connectDB;