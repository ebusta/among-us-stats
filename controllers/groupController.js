const Group = require('../models/groupModel');
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

exports.getAllGroups = catchAsync(async (req, res, next) => {
  const groups = await Group.getAllPlayers();
  sendRes(res, '200', 'success', groups);
});

exports.createGroup = catchAsync(async (req, res, next) => {
  const newGroup = await Group.createGroup(req.body);
  // if the create group request has players attached to it
  if (req.body.players) {
    const newPlayerGroupIDs = await Promise.all(
      req.body.players.map(async (el) => {
        const playerID = await Player.getPlayerIDByName(el.player_name);
        // if player already exists, don't create a new player
        if (playerID) {
          const newPlayerGroupID = await Group.createPlayerGroup(playerID, newGroup.group_id);
          return newPlayerGroupID;
        }
        // player doesn't exist, create a new player
        const newPlayerID = Player.createPlayer(el.player_name);
        return newPlayerID;
      })
    );
    sendRes(res, '201', 'success', [newGroup, newPlayerGroupIDs]);
  }
  // if the create group request has no players attached to it
  sendRes(res, '201', 'success', newGroup);
});
