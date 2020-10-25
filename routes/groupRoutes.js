const express = require('express');
const groupController = require('../controllers/groupController');

const router = express.Router();

router.route('/').get(groupController.getAllGroups).post(groupController.createGroup);

module.exports = router;
