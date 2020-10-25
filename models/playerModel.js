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

exports.createPlayer = async (reqBody) => {
  const newPlayer = await knex('player').returning('*').insert({ player_name: reqBody.player_name });
  return newPlayer;
};
