const knex = require('knex')({
  client: 'pg',
  connection: process.env.PG_CONNECTION_STRING,
  //searchPath: ['knex', 'public'],
  //debug: true,
});

exports.getAllPlayers = async () => {
  const playerList = await knex.select('*').from('player');
  return playerList;
};

exports.createPlayer = async (playerName) => {
  try {
    //console.log(playerName);
    const newPlayer = await knex('player').returning('*').insert({ player_name: playerName });
    return newPlayer;
  } catch (err) {
    //console.log(err);
    return null;
  }
};

exports.getPlayerIDByName = async (playerName, groupID) => {
  try {
    const playerID = await knex('player').where({ player_name: playerName }).select('player_id');
    return playerID;
  } catch (err) {
    //console.log(err);
    return null;
  }
};

exports.getPlayerById = async (player_id) => {
  try {
    const player = await knex('player').where({ player_id }).first();
    return player;
  } catch (err) {
    //console.log(err);
    return null;
  }
};