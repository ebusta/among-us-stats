const Player = require('../models/playerModel');
const catchAsync = require('../utils/catchAsync');
//const AppError = require('../utils/appError');

exports.getAllPlayers = catchAsync(async (req, res, next) => {
  const players = await Player.getAllPlayers();
  res.status('200').json({
    status: 'success',
    results: players.length,
    data: {
      players,
    },
  });
});

exports.createPlayer = catchAsync(async (req, res, next) => {
  const newPlayer = await Player.createPlayer(req.body);

  res.status('201').json({
    status: 'success',
    data: {
      player: newPlayer,
    },
  });
});
