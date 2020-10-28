const express = require('express');
const viewController = require('../controllers/viewController');
const authController = require('../controllers/authController');
const groupController = require('../controllers/groupController');
const mapController = require('../controllers/mapController');

const router = express.Router();

router.get('/', authController.isLoggedIn, viewController.getMain);
router.get('/login', authController.isLoggedIn, viewController.getLoginForm);
router.get('/group', authController.protect, groupController.getAllPlayersInGroup, viewController.getGroup);
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
