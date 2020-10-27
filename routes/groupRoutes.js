const express = require('express');
const groupController = require('../controllers/groupController');
const authController = require('../controllers/authController');

const router = express.Router();

router.route('/').get(authController.protect, groupController.getAllGroups).post(authController.createGroup);
router.route('/addPlayerToGroup/:name').patch(authController.protect, groupController.addPlayerToGroup);
router.route('/login').post(authController.login);
router.route('/logout').get(authController.logout);

module.exports = router;
