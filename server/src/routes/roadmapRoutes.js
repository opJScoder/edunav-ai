const express = require('express');
const router = express.Router();
const roadmapController = require('../controllers/roadmapController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/generate', authMiddleware, roadmapController.generate);
router.get('/', authMiddleware, roadmapController.getRoadmaps);
router.get('/:roadmapId', authMiddleware, roadmapController.getRoadmapById);
router.put('/item/:itemId', authMiddleware, roadmapController.updateRoadmapItem);

module.exports = router;
