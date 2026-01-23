const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

// Debugging line to see if imports are working
console.log("Checking Auth Functions:", { register: !!register, login: !!login });

// Register Route (POST)
router.post('/register', register);

// Login Route (POST)
router.post('/login', login);
// ... existing routes ...
router.get('/profile', authMiddleware, authController.getProfile);
router.put('/profile', authMiddleware, authController.updateProfile);

module.exports = router;