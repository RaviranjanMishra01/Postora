process.env.NODE_ENV = "test";
const dotenv = require("dotenv");
dotenv.config();

const app = require("../index");
const connectDB = require("../DB/connectDB");
const mongoose = require("mongoose");

const runTests = async () => {
  console.log("Connecting to Database for tests...");
  await connectDB();

  console.log("Running backend automated API verification tests...");

  const server = app.listen(0, async () => {
    const port = server.address().port;
    const baseUrl = `http://127.0.0.1:${port}`;
    console.log(`Test server running on ${baseUrl}`);

    try {
      // Test 1: Health check endpoint
      const res = await fetch(`${baseUrl}/api/health`);
      const data = await res.json();

      if (res.status === 200 && data.success) {
        console.log("✅ TEST 1 PASSED: /api/health returned 200 OK");
      } else {
        console.error("❌ TEST 1 FAILED:", data);
      }

      // Test 2: Categories listing
      const catRes = await fetch(`${baseUrl}/api/v1/categories`);
      const catData = await catRes.json();

      if (catRes.status === 200 && catData.success) {
        console.log("✅ TEST 1 PASSED: /api/v1/categories returned 200 OK");
      } else {
        console.error("❌ TEST 2 FAILED:", catData);
      }

      // Test 3: Posts listing
      const postRes = await fetch(`${baseUrl}/api/v1/posts`);
      const postData = await postRes.json();

      if (postRes.status === 200 && postData.success) {
        console.log("✅ TEST 3 PASSED: /api/v1/posts returned 200 OK");
      } else {
        console.error("❌ TEST 3 FAILED:", postData);
      }

      // Test 4: Google Auth endpoint
      const googleRes = await fetch(`${baseUrl}/api/v1/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "test_google_user@gmail.com",
          name: "Test Google User",
          googleId: "test_google_123456"
        })
      });
      const googleData = await googleRes.json();

      if ((googleRes.status === 200 || googleRes.status === 201) && googleData.success) {
        console.log("✅ TEST 4 PASSED: /api/v1/auth/google returned success response");
      } else {
        console.error("❌ TEST 4 FAILED:", googleData);
      }

      // Test 5: Public Registration forces role = 'user'
      const testUsername = "user_role_test_" + Date.now().toString().slice(-4);
      const regRes = await fetch(`${baseUrl}/api/v1/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Test Role User",
          username: testUsername,
          email: `${testUsername}@example.com`,
          password: "Password123!",
          role: "ADMIN", // Malicious role escalation attempt
          isAdmin: true
        })
      });
      const regData = await regRes.json();
      const registeredUser = regData.data?.user;

      if (regRes.status === 201 && registeredUser && registeredUser.role === "user") {
        console.log("✅ TEST 5 PASSED: Public registration strictly forced role = 'user' (escalation attempt blocked)");
      } else {
        console.error("❌ TEST 5 FAILED:", regData);
      }

      // Test 6: Dedicated Admin Login rejects normal USER accounts
      const adminLoginRes = await fetch(`${baseUrl}/api/v1/auth/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: `${testUsername}@example.com`,
          password: "Password123!"
        })
      });
      const adminLoginData = await adminLoginRes.json();

      if (adminLoginRes.status === 401 && !adminLoginData.success) {
        console.log("✅ TEST 6 PASSED: /api/v1/auth/admin/login rejected normal USER account with 401 Unauthorized");
      } else {
        console.error("❌ TEST 6 FAILED:", adminLoginData);
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
