const knex = require('knex')({
  client: 'pg',
  connection: process.env.PG_CONNECTION_STRING,
  //searchPath: ['knex', 'public'],
  //debug: true,
});

exports.getAllGroups = async () => {
  const groupList = await knex.select('*').from('group');
  return groupList;
};

exports.createGroup = async (reqBody) => {
  const newGroup = await knex('group').returning('*').insert({
    group_name: reqBody.group_name,
    pword: reqBody.pword,
  });
  return newGroup;
};

exports.createPlayerGroup = async (playerID, groupID) => {
  const newPlayerGroup = await knex('player_group').returning('*').insert({
    player_id: playerID,
    group_id: groupID,
  });
  return newPlayerGroup;
};
