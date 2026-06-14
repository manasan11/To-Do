const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { breakdownTask, suggestTasks } = require('../controllers/aiController');

router.use(protect);

router.post('/breakdown', breakdownTask);
router.post('/suggest', suggestTasks);

module.exports = router;
