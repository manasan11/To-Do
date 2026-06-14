const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getTasks, getTask, createTask, updateTask, deleteTask,
  reorderTasks, bulkUpdate, getTasksByDateRange,
  completeSubtask, addSubtask
} = require('../controllers/taskController');

router.use(protect);

router.get('/', getTasks);
router.get('/range', getTasksByDateRange);
router.get('/:id', getTask);
router.post('/', [
  body('title').trim().notEmpty().withMessage('Title is required')
], createTask);
router.put('/reorder', reorderTasks);
router.put('/bulk', bulkUpdate);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);
router.put('/:taskId/subtasks/:subtaskId', completeSubtask);
router.post('/:taskId/subtasks', [
  body('title').trim().notEmpty().withMessage('Subtask title is required')
], addSubtask);

module.exports = router;
