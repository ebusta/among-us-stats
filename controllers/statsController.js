//const { body } = require('express-validator');
const Stats = require('../models/statsModel');
// const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.createNewGameStats = async (req, res, next) => {
  // make game records
  const gameID = await Stats.createGameReturnID(req.body, req.group_id, next);
  //console.log(gameID);

  // make playerGame records
  const playerGameIDs = await Promise.all(
    req.body.players.map(async (player) => {
      const playerGameID = await Stats.createPlayerGameReturnID(player, gameID);
      return playerGameID;
    })
  );
  //console.log(playerGameIDs);
  if (!playerGameIDs) {
    throw new AppError('There was a problem logging to the database. Please try again later.', 404);
  }
  //console.log(playerGameIDs);

  // filter on players who have murders
  const playerListFilteredForMurders = req.body.players.filter((el) => el.murders.length);
  //console.log(playerListFilteredForMurders);

  // create murder records
  const murderIDs = await Promise.all(
    playerListFilteredForMurders.map(async (player) => {
      const murderIDList = await Stats.createMurdersReturnIDs(player, gameID);
      return murderIDList;
    })
  );

  res.status(201).json({
    status: 'success',
    data: {
      gameID,
      playerGameIDs,
      murderIDs: murderIDs[0],
      group_id: req.body.group_id,
    },
  });
};

exports.getPlayersByMurderCount = async (req, res, next) => {
  const playersByMurderCount = await Stats.getMostMurders(req.group_id);
  res.playersByMurderCount = playersByMurderCount;
  res.locals.playersByMurderCount = playersByMurderCount;
  return next();
}

exports.getPlayersByImposterCount = async (req, res, next) => {
  const playersByImposterCount = await Stats.getImposterCounts(req.group_id);
  console.log("~ playersByImposterCount", playersByImposterCount);
  res.playersByImposterCount = playersByImposterCount;
  res.locals.playersByImposterCount = playersByImposterCount;
  return next();
}

exports.getKilledByCounts = async (req, res, next) => {
  const killedByCounts = await Stats.getKilledByCounts(req.params.player_id);
  res.killedByCounts = killedByCounts;
  res.locals.killedByCounts = killedByCounts;
  return next();
}

exports.getVictimCounts = async (req, res, next) => {
  const victimCounts = await Stats.getVictimCounts(req.params.player_id);
  res.victimCounts = victimCounts;
  res.locals.victimCounts = victimCounts;
  return next();
}

exports.getWrongEjectionCount = async (req, res, next) => {
  const wrongEjectionCount = await Stats.getWrongEjectionCount(req.params.player_id);
  res.wrongEjectionCount = wrongEjectionCount;
  res.locals.wrongEjectionCount = wrongEjectionCount;
  return next();
}

exports.getKDRatio = async (req, res, next) => {
  const kdRatio = await Stats.getKDRatio(req.params.player_id);
  res.kdRatio = kdRatio;
  res.locals.kdRatio = kdRatio;
  return next();
};
