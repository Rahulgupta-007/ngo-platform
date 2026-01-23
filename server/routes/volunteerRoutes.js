const express = require('express');
const router = express.Router();
const volunteerController = require('../controllers/volunteerController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, volunteerController.createPost);
router.get('/', volunteerController.getAllPosts);
router.get('/my-posts', authMiddleware, volunteerController.getMyPosts);

// --- NEW ROUTES ---
router.post('/apply', authMiddleware, volunteerController.applyForPost);
router.get('/applications', authMiddleware, volunteerController.getMyApplications);
// ... existing routes ...
router.get('/:id/applications', authMiddleware, volunteerController.getPostApplications);


module.exports = router;