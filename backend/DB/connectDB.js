const mongoose = require("mongoose");
const seedInitialData = require("../utils/seedData");

/**
 * Automatically safe-encode username and password in MongoDB URI string
 */
const formatMongoUri = (uri) => {
  if (!uri || typeof uri !== "string") return uri;
  try {
    const match = uri.match(/^(mongodb(?:\+srv)?:\/\/)([^:]+):([^@]+)@(.+)$/);
    if (match) {
      const protocol = match[1];
      const rawUser = match[2];
      const rawPass = match[3];
      const rest = match[4];

      const cleanUser = encodeURIComponent(decodeURIComponent(rawUser));
      const cleanPass = encodeURIComponent(decodeURIComponent(rawPass));

      return `${protocol}${cleanUser}:${cleanPass}@${rest}`;
    }
  } catch (e) {
    // Return original URI if custom format
  }
  return uri;
};

const connectDB = async () => {
  let primaryUri = process.env.MONGO_URI || process.env.DBURI;
  if (primaryUri) {
    primaryUri = formatMongoUri(primaryUri);
  }
  const localUri = "mongodb://127.0.0.1:27017/Postora";

  if (primaryUri) {
    try {
      const conn = await mongoose.connect(primaryUri, { dbName: "Postora" });
      console.log(`MongoDB Connected to Database [${conn.connection.name}]: ${conn.connection.host}`);
      await seedInitialData();
      return;
    } catch (error) {
      console.error(`Error connecting to Primary MongoDB: ${error.message}`);
      
      if (error.message.includes("bad auth") || error.message.includes("Authentication failed") || error.code === 8000) {
        console.warn("\n-------------------------------------------------------------");
        console.warn("⚠️ MONGO DB AUTHENTICATION FAILED!");
        console.warn("Please check your MongoDB Atlas credentials in .env:");
        console.warn("Verify username & password in MongoDB Atlas -> Security -> Database Access.");
        console.warn("-------------------------------------------------------------\n");
      }

      // Try local fallback for seamless development
      try {
        console.log("Attempting fallback to local MongoDB (127.0.0.1:27017)...");
        const conn = await mongoose.connect(localUri, { dbName: "Postora" });
        console.log(`Local MongoDB Connected to Database [${conn.connection.name}]: ${conn.connection.host}`);
        await seedInitialData();
        return;
      } catch (localErr) {
        console.error(`Local MongoDB fallback also failed: ${localErr.message}`);
      }
    }
  } else {
    try {
      const conn = await mongoose.connect(localUri, { dbName: "Postora" });
      console.log(`MongoDB Connected to Database [${conn.connection.name}]: ${conn.connection.host}`);
      await seedInitialData();
      return;
    } catch (error) {
      console.error(`Error connecting to local MongoDB: ${error.message}`);
    }
  }
};

module.exports = connectDB;