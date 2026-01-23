const express = require('express');
const router = express.Router();
const donationController = require('../controllers/donationController');
const authMiddleware = require('../middleware/authMiddleware');

// Process a new donation
router.post('/', authMiddleware, donationController.createDonation);

// Get logged-in user's history
router.get('/my-donations', authMiddleware, donationController.getMyDonations);

module.exports = router;