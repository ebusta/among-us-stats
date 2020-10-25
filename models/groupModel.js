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
  //console.log(playerID, groupID);
  const newPlayerGroup = await knex('player_group').returning('*').insert({
    player_id: playerID,
    group_id: groupID,
  });
  return newPlayerGroup;
};

exports.checkIfGroupExists = async (groupID) => {
  try {
    const group = await knex('group_').where({ group_id: groupID }).select('group_id');
    return group;
  } catch (err) {
    return null;
  }
};

exports.checkIfPlayerInGroup = async (playerID, groupID) => {
  try {
    //console.log(playerID, groupID);
    const playerGroup = await knex('player_group')
      .where({
        player_id: playerID,
        group_id: groupID,
      })
      .select('player_group_id');
    return playerGroup;
  } catch (err) {
    return null;
  }
};
