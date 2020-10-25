const express = require('express');
//const playerController = require('../controllers/playerController');

const router = express.Router();

router.get('/', (req, res) => {
  res.render('form', { title: 'New Game Form' });
});

router.post('/', (req, res) => {
  res.render('form', { title: 'New Game Form' });
});

module.exports = router;
