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
  const newPlayer = await knex('player').returning('*').insert({ player_name: playerName });
  return newPlayer;
};

exports.getPlayerIDByName = async (playerName) => {
  const playerID = await knex('player').where({ player_name: playerName }).select('player_id');
  return playerID;
};
