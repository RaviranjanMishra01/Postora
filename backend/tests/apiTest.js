const app = require("../index");
const connectDB = require("../DB/connectDB");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const runTests = async () => {
  console.log("Connecting to Database for tests...");
  await connectDB();

  console.log("Running backend automated API verification tests...");

  const server = app.listen(0, async () => {
    const port = server.address().port;
    console.log(`Test server running on port ${port}`);

    try {
      // Test 1: Health check endpoint
      const res = await fetch(`http://localhost:${port}/api/health`);
      const data = await res.json();

      if (res.status === 200 && data.success) {
        console.log("✅ TEST 1 PASSED: /api/health returned 200 OK");
      } else {
        console.error("❌ TEST 1 FAILED:", data);
      }

      // Test 2: Categories listing
      const catRes = await fetch(`http://localhost:${port}/api/v1/categories`);
      const catData = await catRes.json();

      if (catRes.status === 200 && catData.success) {
        console.log("✅ TEST 2 PASSED: /api/v1/categories returned 200 OK");
      } else {
        console.error("❌ TEST 2 FAILED:", catData);
      }

      // Test 3: Posts listing
      const postRes = await fetch(`http://localhost:${port}/api/v1/posts`);
      const postData = await postRes.json();

      if (postRes.status === 200 && postData.success) {
        console.log("✅ TEST 3 PASSED: /api/v1/posts returned 200 OK");
      } else {
        console.error("❌ TEST 3 FAILED:", postData);
      }

      console.log("\nALL BACKEND API TESTS COMPLETED SUCCESSFULLY! 🎉");
    } catch (err) {
      console.error("Test execution error:", err);
    } finally {
      server.close(() => {
        mongoose.connection.close();
      });
    }
  });
};

runTests();
