const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getDashboardStats, getWeeklyData, getMonthlyData,
  getCategoryAnalytics, getProductivityTrend
} = require('../controllers/analyticsController');

router.use(protect);

router.get('/dashboard', getDashboardStats);
router.get('/weekly', getWeeklyData);
router.get('/monthly', getMonthlyData);
router.get('/categories', getCategoryAnalytics);
router.get('/trend', getProductivityTrend);

module.exports = router;
