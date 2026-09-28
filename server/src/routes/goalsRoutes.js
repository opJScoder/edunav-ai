const express = require('express');
const router = express.Router();
const goalsController = require('../controllers/goalsController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, goalsController.getGoals);
router.post('/', authMiddleware, goalsController.createGoal);
router.put('/:goalId', authMiddleware, goalsController.updateGoal);
router.delete('/:goalId', authMiddleware, goalsController.deleteGoal);

module.exports = router;
