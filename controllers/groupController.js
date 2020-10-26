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

exports.getAllGroups = catchAsync(async (req, res, next) => {
  const groups = await Group.getAllGroups();
  sendRes(res, '200', 'success', groups);
});

// exports.createGroup = catchAsync(async (req, res, next) => {
//   const newGroup = await Group.createGroup(req.body);
//   // if the create group request has players attached to it
//   if (req.body.players) {
//     const newPlayerGroupIDs = await Promise.all(
//       req.body.players.map(async (el) => {
//         const playerID = await Player.getPlayerIDByName(el.player_name);
//         // if player already exists, don't create a new player
//         if (playerID) {
//           const newPlayerGroupID = await Group.createPlayerGroup(playerID, newGroup.group_id);
//           return newPlayerGroupID;
//         }
//         // player doesn't exist, create a new player
//         const newPlayerID = Player.createPlayer(el.player_name);
//         return newPlayerID;
//       })
//     );
//     sendRes(res, '201', 'success', [newGroup, newPlayerGroupIDs]);
//   }
//   // if the create group request has no players attached to it
//   sendRes(res, '201', 'success', newGroup);
// });

exports.addPlayerToGroup = catchAsync(async (req, res, next) => {
  // check if group exists
  const groupID = await Group.checkIfGroupExists(req.body.group_id);
  //group doesn't exist
  if (!groupID) {
    return next(new AppError('This group does not exist!', 404));
  }
  // group exists, so check if player exists
  const playerID = await Player.getPlayerIDByName(req.params.name);
  // player does not exist
  if (playerID.length === 0) {
    // make new player, add to group
    const newPlayerID = await Player.createPlayer(req.params.name);
    const playerGroupID = await Group.createPlayerGroup(newPlayerID[0].player_id, req.body.group_id);
    sendRes(res, '201', 'success', {
      player_id: newPlayerID[0].player_id,
      player_name: newPlayerID[0].player_name,
      player_group_id: playerGroupID[0].player_group_id,
      group_id: req.body.group_id,
    });
  }
  // group and player exist, so check if player is already in group
  const playerGroup = await Group.checkIfPlayerInGroup(playerID[0].player_id, req.body.group_id);
  // player is already in group
  if (playerGroup[0]) {
    return next(new AppError('This player is already in this group!', 400));
  }
  // group and player exist, player is not in group
  const playerGroupID = await Group.createPlayerGroup(playerID[0].player_id, req.body.group_id);
  sendRes(res, '201', 'success', {
    player_id: playerID[0].player_id,
    player_name: playerID[0].player_name,
    player_group_id: playerGroupID[0].player_group_id,
    group_id: req.body.group_id,
  });
});
