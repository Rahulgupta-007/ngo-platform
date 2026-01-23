// server/test-auth.js
// This script simulates a Frontend trying to talk to your Backend
const API_URL = 'http://localhost:5000/api/auth';

async function testAuth() {
  console.log("--- 🚀 STARTING AUTH TEST ---");

  // 1. DATA TO TEST
  const testUser = {
    name: "Volunteer Rahul",
    email: "rahul" + Math.floor(Math.random() * 1000) + "@test.com", // Random email so it doesn't fail on run #2
    password: "securePassword123",
    role: "VOLUNTEER"
  };

  try {
    // 2. TEST REGISTRATION
    console.log(`\n1. Attempting to Register: ${testUser.email}...`);
    const regRes = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testUser)
    });
    const regData = await regRes.json();
    console.log("Response:", regData);

    if (regRes.status !== 201) throw new Error("Registration Failed!");

    // 3. TEST LOGIN
    console.log(`\n2. Attempting to Login...`);
    const loginRes = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testUser.email, password: testUser.password })
    });
    const loginData = await loginRes.json();
    
    if (loginData.token) {
        console.log("✅ SUCCESS! Token received:");
        console.log(loginData.token.substring(0, 30) + "..."); // Print first 30 chars of token
    } else {
        console.log("❌ Login Failed:", loginData);
    }

  } catch (error) {
    console.error("❌ ERROR:", error.message);
  }
}

testAuth();