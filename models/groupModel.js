const knex = require('knex')({
  client: 'pg',
  connection: process.env.PG_CONNECTION_STRING,
  //searchPath: ['knex', 'public'],
  //debug: true,
});
const bcrypt = require('bcryptjs');
//const crypto = require('crypto');

encryptPword = async (pword) => {
  const encryptedPword = await bcrypt.hash(pword, 12);
  return encryptedPword;
};

exports.getAllGroups = async () => {
  const groupList = await knex.select('*').from('group_');
  return groupList;
};

exports.createGroup = async (reqBody) => {
  console.log("Creating group")
  console.log("~ reqBody", reqBody);
  try {
    const encryptedPword = await encryptPword(reqBody.pword);
    console.log("~ encryptedPword", encryptedPword);
    const newGroup = await knex('group_').returning('*').insert({
      group_name: reqBody.group_name,
      pword: encryptedPword,
    });
    console.log("~ newGroup", newGroup);
    return newGroup;
  } catch (err) {
    return null;
  }
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
    const group = await knex('group_').where({ group_id: groupID }).select('group_id', 'group_name');
    return group;
  } catch (err) {
    return null;
  }
};

exports.findGroupByName = async (groupName) => {
  try {
    const group = await knex('group_').where({ group_name: groupName }).select('group_id', 'group_name', 'pword');
    return group;
  } catch (err) {
    return null;
  }
};

exports.findGroupByID = async (groupID) => {
  try {
    const group = await knex('group_').where({ group_id: groupID }).select('group_id', 'group_name', 'pword');
    return group;
  } catch (err) {
    return null;
  }
};

exports.checkIfPlayerInGroup = async (playerID, groupID) => {
  try {
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

exports.getAllPlayersInGroup = async (groupID) => {
  try {
    const players = await knex('player_group')
      .join('player', 'player_group.player_id', '=', 'player.player_id')
      .where({ 'player_group.group_id': groupID })
      .select('player.player_name', 'player.player_id');
    return players;
  } catch (err) {
    // console.log(err);
    return null;
  }
};

exports.correctPassword = async (pword, pwordToCheck) => {
  return await bcrypt.compare(pword, pwordToCheck);
};
