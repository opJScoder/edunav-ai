const express = require('express');
const router = express.Router();
const progressController = require('../controllers/progressController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, progressController.getProgress);
router.post('/log', authMiddleware, progressController.logProgress);

module.exports = router;
