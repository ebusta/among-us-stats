const Player = require('../models/playerModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

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

exports.getPlayer = catchAsync(async (req, res, next) => {
  const player = await Player.getPlayerById(req.params.player_id);
  res.player = player;
  res.locals.player = player;
  return next();
});

exports.createPlayer = catchAsync(async (req, res, next) => {
  const newPlayer = await Player.createPlayer(req.body.player_name);
  if (!newPlayer) {
    return next(new AppError('Player name is already taken, please try another.', 400));
  }
  sendRes(res, '201', 'success', newPlayer);
});
