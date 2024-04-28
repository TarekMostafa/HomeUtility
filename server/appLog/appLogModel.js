const Sequelize = require('sequelize');
const sequelize = require('../db/dbConnection').getSequelize();
const UserModel = require('../auth/userModel');

class AppLogModel extends Sequelize.Model {}
AppLogModel.init({
    logId: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
    logUserId: Sequelize.INTEGER,
    logUserName: Sequelize.STRING(20),
    logMethod: Sequelize.STRING(10),
    logPathName: Sequelize.STRING(200),
    logReqQuery: Sequelize.STRING(200),
    logReqBody: Sequelize.STRING(1000),
    logReqTimestamp: Sequelize.DATE,
    logResStatus: Sequelize.ENUM('SUCCESS', 'FAILED'),
    logResStatusCode: Sequelize.STRING(5),
    logResErrorMsg: Sequelize.STRING(200),
    logResTimestamp: Sequelize.DATE
}, {
  tableName: 'applog',
  createdAt: false,
  updatedAt: false,
  sequelize
});

AppLogModel.belongsTo(UserModel, {
  as: "user",
  foreignKey: 'logUserId'
});

module.exports = AppLogModel;
