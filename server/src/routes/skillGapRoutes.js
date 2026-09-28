const express = require('express');
const router = express.Router();
const skillGapController = require('../controllers/skillGapController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/analyze', authMiddleware, skillGapController.analyze);

module.exports = router;
