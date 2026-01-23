const express = require('express');
const router = express.Router();
const campaignController = require('../controllers/campaignController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, campaignController.createCampaign);
router.get('/', campaignController.getAllCampaigns);

// UPDATED: Now uses authMiddleware because we need to know WHO donated
router.post('/donate', authMiddleware, campaignController.donateToCampaign);

// NEW: Get History
router.get('/my-donations', authMiddleware, campaignController.getMyDonations);
router.get('/my-campaigns', authMiddleware, campaignController.getMyCampaigns);

module.exports = router;