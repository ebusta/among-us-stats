const knex = require('knex')({
  client: 'pg',
  connection: process.env.PG_CONNECTION_STRING,
  //searchPath: ['knex', 'public'],
  //debug: true,
});

exports.getAllMaps = async () => {
  const mapList = await knex.select('*').from('map');
  return mapList;
};
