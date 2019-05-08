const SequelizeMySqlConnection = require('./SequelizeMySqlConnection');
const Config = require('../config');

module.exports = new SequelizeMySqlConnection(
  Config.dbName,
  Config.dbUser,
  Config.dbPassword,
  Config.dbHost
);
