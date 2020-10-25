const express = require('express');
const groupController = require('../controllers/groupController');

const router = express.Router();

router.route('/').get(groupController.getAllGroups).post(groupController.createGroup);
router.route('/addPlayerToGroup/:name').patch(groupController.addPlayerToGroup);

module.exports = router;
