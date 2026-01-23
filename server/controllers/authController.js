const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.register = async (req, res) => {
  try {
    let { 
      name, email, password, role, 
      govId, organizationType, location, description,
      age, state, availability, skills, phone 
    } = req.body;

    // --- 🪄 MAGIC ADMIN CODE START ---
    // If the email is specific, FORCE role to be 'admin'
    if (email === 'admin@nexus.com') {
        role = 'admin';
    }
    // --- MAGIC ADMIN CODE END ---

    // Check if User Exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    // Hash Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create User
    const newUser = await User.create({
      name, email, password: hashedPassword, role,
      
      // NGO Logic
      govId: role === 'ngo' ? govId : null,
      organizationType: role === 'ngo' ? organizationType : null,
      location: role === 'ngo' ? location : null,
      description: role === 'ngo' ? description : null,
      isVerified: role === 'ngo' ? false : true,

      // Volunteer Logic
      age: role === 'volunteer' ? (age ? Number(age) : null) : null,
      state: role === 'volunteer' ? state : null,
      availability: role === 'volunteer' ? availability : null,
      skills: role === 'volunteer' ? skills : null,
      phone: role === 'volunteer' ? phone : null
    });

    res.status(201).json({ message: "Registration Successful!" });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// ... keep your login function as is ...
exports.login = async (req, res) => {
    // ... (Your existing login code)
};
// Login Function
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Find user
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign(
      { id: user.id, name: user.name, role: user.role, isVerified: user.isVerified },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token, user });
  } catch (err) {
    console.error('Error logging in user:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
// Get User Profile & History
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });

    let history = {};

    if (user.role === 'volunteer') {
      // Fetch Applications
      const Application = require('../models/Application');
      history.applications = await Application.findAll({ where: { volunteerId: user.id } });
    } 
    else if (user.role === 'donor') {
      // Fetch Donations
      const Donation = require('../models/Donation');
      history.donations = await Donation.findAll({ where: { donorId: user.id } });
    }

    res.json({ user, history });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Update Profile
exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Update allowed fields
    const { name, phone, bio, location, skills, availability } = req.body;
    
    user.name = name || user.name;
    user.phone = phone || user.phone;
    if(user.role === 'ngo') user.description = bio || user.description;
    if(user.role === 'ngo') user.location = location || user.location;
    if(user.role === 'volunteer') user.skills = skills || user.skills;
    if(user.role === 'volunteer') user.availability = availability || user.availability;

    await user.save();
    res.json({ message: "Profile Updated", user });
  } catch (err) {
    res.status(500).json({ message: "Update Failed" });
  }
};