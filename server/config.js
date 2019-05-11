const dotenv = require('dotenv');
const AesCBC = require('./utilities/aesCBC');

dotenv.config();

module.exports = {
  port: process.env.PORT,
  dbName: process.env.DBNAME,
  dbUser: process.env.DBUSER,
  dbPassword: AesCBC.decrypt(process.env.DBPASSWORD),
  dbHost: process.env.DBHOST,
  appSettingKey: process.env.APP_SETTING_KEY,
  backupPath: process.env.BACKUP_PATH,
  mySqlBinPath: process.env.MYSQL_BIN_PATH,
};
