const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { getAchievements, checkAchievements } = require('../controllers/achievementController');

router.use(protect);

router.get('/', getAchievements);
router.post('/check', checkAchievements);

module.exports = router;
