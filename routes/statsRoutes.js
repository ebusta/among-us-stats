const { check, body, validationResult } = require('express-validator');
const express = require('express');
const validate = require('../utils/validation');
const statsController = require('../controllers/statsController');

const router = express.Router();

router.route('/').post(validate.newStats, statsController.createNewGameStats);

module.exports = router;
