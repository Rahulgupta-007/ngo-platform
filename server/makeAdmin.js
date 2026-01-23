const sequelize = require('./config/db');
const User = require('./models/User');

const makeAdmin = async () => {
  try {
    // 1. Connect to Database
    await sequelize.authenticate();
    console.log("🔌 Connected to Database.");

    // 2. Find the user you just registered
    const email = 'admin@nexus.com'; // <--- MUST MATCH YOUR REGISTRATION EMAIL
    const user = await User.findOne({ where: { email } });

    if (!user) {
      console.log("❌ User not found! Did you register on the website first?");
      return;
    }

    // 3. Update Role to Admin
    user.role = 'admin';
    user.isVerified = true; // Admins are always verified
    await user.save();

    console.log(`✅ SUCCESS: ${user.name} is now a Super Admin!`);
    console.log("👉 You can now login at http://localhost:3000/login");

  } catch (err) {
    console.error("❌ Error:", err);
  }
};

makeAdmin();