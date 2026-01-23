const express = require('express');
const router = express.Router();
const publicController = require('../controllers/publicController');

// No Auth Middleware needed here!
router.get('/stats', publicController.getLandingStats);

module.exports = router;
