const SequelizeMySqlConnection = require('./SequelizeMySqlConnection');

const dbName = 'homeutilitydb';
const dbUser = 'root';
const dbPassword = '123456Aa';
const dbHost = 'localhost';

module.exports = new SequelizeMySqlConnection(dbName, dbUser, dbPassword, dbHost);
