const { Model } = require('sequelize');
const Sequelize = require('sequelize');
const sequelize = require('../db/dbConnection').getSequelize();

class AppSettingsModel extends Model {}
AppSettingsModel.init({
  appCode: { type: Sequelize.STRING(3), primaryKey: true },
  baseCurrency: Sequelize.STRING(3),
}, {
  tableName: 'appsettings',
  createdAt: false,
  updatedAt: false,
  sequelize
});

module.exports = AppSettingsModel;
