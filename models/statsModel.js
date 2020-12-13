const knex = require('knex')({
  client: 'pg',
  connection: process.env.PG_CONNECTION_STRING,
  //searchPath: ['knex', 'public'],
  //debug: true,
});
const moment = require('moment');

//const catchAsync = require('../utils/catchAsync');
//const AppError = require('../utils/appError');

exports.createGameReturnID = async (reqBody, groupID, next) => {
  const time = moment().format();
  const gameID = await knex('game').returning('game_id').insert({
    game_date: time,
    map_id: reqBody.map_id,
    who_won: reqBody.who_won,
    how_victory_achieved: reqBody.how_victory_achieved,
    group_id: groupID,
  });
  return gameID[0];
};

exports.createPlayerGameReturnID = async (player, gameID) => {
  console.log(player.death_type);
  try {
    const playerGameID = await knex('player_game').returning('player_game_id').insert({
      player_id: player.player_id,
      game_id: gameID,
      player_type: player.player_type,
      death_type: player.death_type,
      is_victorious: player.is_victorious,
    });
    return playerGameID[0];
  } catch (err) {
    return null;
  }
};

exports.createMurdersReturnIDs = async (player, gameID) => {
  //console.log(gameID);
  //console.log(player);
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

exports.getMostMurders = async (groupId) => {
  try {
    const playersOrderedByKillCount = await knex
      .select(knex.raw('count(*) as kill_count, player.player_id, player.player_name'))
      .from('murder')
      .join('player', 'murder.player_id', '=', 'player.player_id')
      .join('player_group', 'player.player_id', '=', 'player_group.player_id')
      .join('group_', 'group_.group_id', '=', 'player_group.group_id')
      .where({ 'group_.group_id': groupId })
      .groupBy('player.player_id')
      .orderByRaw('1 DESC');
    return playersOrderedByKillCount;
  } catch (err) {
    console.log('Error trying to find killcount: ', err);
    return null;
  }
};

exports.getImposterCounts = async (groupId) => {
  try {
    const playersOrderedByImposterCount = await knex
      .select(knex.raw('count(*) as imposter_count, player.player_id, player.player_name'))
      .from('player')
      .join('player_group', 'player.player_id', '=', 'player_group.player_id')
      .join('group_', 'group_.group_id', '=', 'player_group.group_id')
      .join('player_game', 'player_game.player_id', '=', 'player.player_id')
      .where({ 'group_.group_id': groupId })
      .where({ 'player_game.player_type': 'imp' })
      .groupBy('player.player_id')
      .orderByRaw('1 DESC');
    return playersOrderedByImposterCount;
  } catch (err) {
    console.log('Error trying to find killcount: ', err);
    return null;
  }
};

exports.getKilledByCounts = async (player_id) => {
  try {
    const playersKilledByCounts = await knex
      .select(knex.raw('count(*) as killedby_count, murder.player_id, player.player_name'))
      .from('murder')
      .join('player', 'player.player_id', '=', 'murder.player_id')
      .where({ 'murder.victim_id': player_id })
      .groupBy('murder.player_id', 'player.player_name')
      .orderByRaw('1 DESC');
    return playersKilledByCounts;
  } catch (err) {
    console.log('Error trying to find killedby count: ', err);
    return null;
  }
};

exports.getVictimCounts = async (player_id) => {
  try {
    const victimCounts = await knex
      .select(knex.raw('count(*) as victim_count, murder.victim_id, player.player_name'))
      .from('murder')
      .join('player', 'player.player_id', '=', 'murder.victim_id')
      .where({ 'murder.player_id': player_id })
      .groupBy('murder.player_id', 'murder.victim_id', 'player.player_name')
      .orderByRaw('1 DESC');
    return victimCounts;
  } catch (err) {
    console.log('Error trying to find victim count: ', err);
    return null;
  }
};
