const express = require('express');
const playerController = require('../controllers/playerController');

const router = express.Router();

router.route('/').get(playerController.getAllPlayers).post(playerController.createPlayer);

module.exports = router;
