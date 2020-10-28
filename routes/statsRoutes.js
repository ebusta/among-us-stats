// const { check, body, validationResult } = require('express-validator');
const express = require('express');
const validate = require('../utils/validation');
const authController = require('../controllers/authController');
const statsController = require('../controllers/statsController');

const router = express.Router();

router.route('/').post(authController.protect, /*validate.newStats, */ statsController.createNewGameStats);

module.exports = router;
