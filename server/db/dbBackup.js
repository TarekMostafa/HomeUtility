const { exec } = require('child_process');
const Config = require('../config');
//const APIResponse = require('../utilities/apiResponse');

async function DBBackup() {
  //construct database file backup name
  let dateStr = new Date().toISOString().slice(0,19);
  dateStr = dateStr.split(':').join('');
  dateStr = dateStr.split('-').join('');
  const filename = Config.dbName + "_" + dateStr + ".sql";
  const command = '\"' + Config.mySqlBinPath + 'mysqldump\" -u ' + Config.dbUser + ' -p' +
    Config.dbPassword + ' ' + Config.dbName + ' > \"' +
    Config.backupPath + filename + '\"';
  //Execute Command
  console.log(command);
  await exec(command);
  //return APIResponse.getAPIResponse(true, null, '046');
}

module.exports = DBBackup;
