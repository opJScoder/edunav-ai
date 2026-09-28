const express = require('express');
const router = express.Router();
const careersController = require('../controllers/careersController');

router.get('/', careersController.getCareers);
router.get('/:careerId', careersController.getCareerById);

module.exports = router;
