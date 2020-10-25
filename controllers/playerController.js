const Player = require('../models/playerModel');
const catchAsync = require('../utils/catchAsync');
//const AppError = require('../utils/appError');

const sendRes = (res, statusCode, status, data) => {
  res.status(statusCode).json({
    status: status,
    results: data.length,
    data,
  });
};

exports.getAllPlayers = catchAsync(async (req, res, next) => {
  const players = await Player.getAllPlayers();
  sendRes(res, '200', 'success', players);
});

exports.createPlayer = catchAsync(async (req, res, next) => {
  const newPlayer = await Player.createPlayer(req.body.player_name);
  sendRes(res, '201', 'success', newPlayer);
});
