const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/stats', authMiddleware, adminController.getDashboardStats);
router.post('/approve', authMiddleware, adminController.verifyNGO);
router.post('/stop-campaign', authMiddleware, adminController.stopCampaign);
router.post('/approve-ngo', authMiddleware, adminController.verifyNGO); // Ensure this matches frontend
router.post('/reject-ngo', authMiddleware, adminController.rejectNGO); // <--- NEW

module.exports = router;