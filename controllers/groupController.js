const Group = require('../models/groupModel');
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

exports.getAllPlayersInGroup = catchAsync(async (req, res, next) => {
  const players = await Group.getAllPlayersInGroup(req.group[0].group_id);
  //console.log(players);
  req.players = players;
  res.locals.players = players;
  return next();
});

exports.getAllPlayersInGroupNoMiddleware = catchAsync(async (req, res, next) => {
  const players = await Group.getAllPlayersInGroup(req.group[0].group_id);
  sendRes(res, '200', 'success', players);
});

exports.getGroupByName = catchAsync(async (req, res, next) => {
  const group = await Group.getGroupByName(req.body);
  sendRes(res, '200', 'success', group);
});

exports.getGroupByID = catchAsync(async (req, res, next) => {
  const group = await Group.getGroupByName(req.body);
  sendRes(res, '200', 'success', group);
});

exports.getAllGroups = catchAsync(async (req, res, next) => {
  const groups = await Group.getAllGroups();
  sendRes(res, '200', 'success', groups);
});

exports.addPlayerToGroup = catchAsync(async (req, res, next) => {
  // check if group exists
  const groupID = await Group.checkIfGroupExists(req.group[0].group_id);
  //group doesn't exist
  if (!groupID) {
    return next(new AppError('This group does not exist!', 404));
  }

  // group exists, so check if player in group

  // get all players in group
  const playersInGroup = await Group.getAllPlayersInGroup(groupID[0].group_id);
  // check if new player name is in group already
  const playerNames = playersInGroup.map((el) => {
    return el.player_name;
  });
  // player name not in group
  if (!playerNames.includes(req.params.name)) {
    console.log('not in group');
    // make new player, add to group
    const newPlayerID = await Player.createPlayer(req.params.name);
    const playerGroupID = await Group.createPlayerGroup(newPlayerID[0].player_id, req.group[0].group_id);
    sendRes(res, '201', 'success', {
      player_id: newPlayerID[0].player_id,
      player_name: newPlayerID[0].player_name,
      player_group_id: playerGroupID[0].player_group_id,
      group_id: req.body.group_id,
    });
  }
  // Player name already exists in group
  return next(new AppError('This player is already in this group!', 400));
});
