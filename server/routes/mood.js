const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { logMood, getMoodHistory, getMoodSuggestions } = require('../controllers/moodController');

router.use(protect);

router.post('/', logMood);
router.get('/', getMoodHistory);
router.get('/suggestions', getMoodSuggestions);

module.exports = router;
