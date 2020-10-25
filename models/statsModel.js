const knex = require('knex')({
  client: 'pg',
  connection: process.env.PG_CONNECTION_STRING,
  //searchPath: ['knex', 'public'],
  //debug: true,
});
const moment = require('moment');

const catchAsync = require('../utils/catchAsync');
//const AppError = require('../utils/appError');

exports.createGameReturnID = async (reqBody, next) => {
  const time = moment().format();
  const gameID = await knex('game').returning('game_id').insert({
    game_date: time,
    map_id: reqBody.map_id,
    who_won: reqBody.who_won,
    how_victory_achieved: reqBody.how_victory_achieved,
  });
  return gameID[0];
};

exports.createPlayerGameReturnID = async (player, gameID) => {
  const playerGameID = await knex('player_game').returning('player_game_id').insert({
    player_id: player.player_id,
    game_id: gameID,
    player_type: player.player_type,
    death_type: player.death_type,
    is_victorious: player.is_victorious,
  });
  return playerGameID[0];
};

exports.createMurdersReturnIDs = async (player, gameID) => {
  const murderIDs = await Promise.all(
    player.murders.map(async (victim) => {
      const murderID = await knex('murder').returning('murder_id').insert({
        player_id: player.player_id,
        game_id: gameID,
        victim_id: victim,
      });
      return murderID[0];
    })
  );
  return murderIDs;
};
