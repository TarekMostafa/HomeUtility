const AppLogModel = require('./appLogModel');

class AppLogRepo {
  static async addLog(appLog, dbTransaction) {
    return await AppLogModel.build(appLog).save({transaction: dbTransaction});
  }

  static async getLog(logId) {
    return await AppLogModel.findByPk(logId);
  }
}

module.exports = AppLogRepo;
