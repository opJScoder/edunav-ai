const express = require('express');
const router = express.Router();
const projectsController = require('../controllers/projectsController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', projectsController.getProjects);
router.get('/recommended', authMiddleware, projectsController.getRecommended);

module.exports = router;
