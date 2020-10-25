//const { body } = require('express-validator');
const Stats = require('../models/statsModel');
// const catchAsync = require('../utils/catchAsync');
//const AppError = require('../utils/appError');

exports.createNewGameStats = async (req, res, next) => {
  // make game records
  const gameID = await Stats.createGameReturnID(req.body, next);
  //console.log(gameID);

  // make playerGame records
  const playerGameIDs = await Promise.all(
    req.body.players.map(async (player) => {
      const playerGameID = await Stats.createPlayerGameReturnID(player, gameID);
      return playerGameID;
    })
  );
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
