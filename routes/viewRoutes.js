const express = require('express');
const viewController = require('../controllers/viewController');
const authController = require('../controllers/authController');
const groupController = require('../controllers/groupController');
const mapController = require('../controllers/mapController');
const statsController = require('../controllers/statsController');
const playerController = require('../controllers/playerController');

const router = express.Router();

router.get('/', authController.isLoggedIn, viewController.getMain);
router.get('/login', authController.isLoggedIn, viewController.getLoginForm);
router.get(
  '/group',
  authController.protect,
  groupController.getAllPlayersInGroup,
  statsController.getPlayersByMurderCount,
  statsController.getPlayersByImposterCount,
  viewController.getGroup
);
router.get(
  '/player/:player_id',
  authController.protect,
  playerController.getPlayer,
  statsController.getKilledByCounts,
  statsController.getVictimCounts,
  statsController.getWrongEjectionCount,
  statsController.getKDRatio,
  viewController.getPlayer
);
router.get('/create-new-group', authController.isLoggedIn, viewController.createNewGroup);
router.get(
  '/newgame',
  authController.protect,
  mapController.getAllMaps,
  groupController.getAllPlayersInGroup,
  viewController.newGame
);

// NOT CURRENTLY IMPLEMENTED
// router.post('/submit-user-data', authController.protect, viewController.updateUserData);

module.exports = router;
