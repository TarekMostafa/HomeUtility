const { exec } = require('child_process');
const Config = require('../config');
const APIResponse = require('../utilities/apiResponse');

async function DBBackup() {
  let cmds = [];
  // First Command
  cmds[0] = 'cd \"' + Config.mySqlBinPath + '\"'
  // Second Command
  let dateStr = new Date().toISOString().slice(0,19);
  dateStr = dateStr.split(':').join('');
  dateStr = dateStr.split('-').join('');
  const filename = Config.dbName + "_" + dateStr + ".sql";
  cmds[1] = 'mysqldump -u ' + Config.dbUser + ' -p' +
    Config.dbPassword + ' ' + Config.dbName + ' > \"' +
    Config.backupPath + filename + '\"';
  //Execute Commands
  console.log(cmds);
  for(let counter=0; counter<cmds.length; counter++) {
    await exec(cmds[counter]);
  }
}

module.exports = DBBackup;
