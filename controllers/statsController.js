//const { body } = require('express-validator');
const Stats = require('../models/statsModel');
const catchAsync = require('../utils/catchAsync');
//const AppError = require('../utils/appError');

exports.createNewGameStats = async (req, res, next) => {
  // make game records
  const gameID = await Stats.createGameReturnID(req.body, next);

  // make playerGame records
  const playerGameIDs = await Promise.all(
    req.body.players.map(async (player) => {
      const playerGameID = await Stats.createPlayerGameReturnID(player, gameID);
      return playerGameID;
    })
  );

  // filter on players who have murders
  const playerListFilteredForMurders = req.body.players.filter((el) => el.murders.length);

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
    },
  });
};
