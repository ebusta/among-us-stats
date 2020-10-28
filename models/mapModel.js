const knex = require('knex')({
  client: 'pg',
  connection: process.env.PG_CONNECTION_STRING,
  //searchPath: ['knex', 'public'],
  //debug: true,
});

exports.getAllMaps = async () => {
  try {
    const mapList = await knex.select('*').from('map');
    return mapList;
  } catch (err) {
    return null;
  }
};
