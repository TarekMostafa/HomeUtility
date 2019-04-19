const { Model } = require('sequelize');
const Sequelize = require('sequelize');
const sequelize = require('../db/dbConnection').getSequelize();
const CurrencyModel = require('../currencies/CurrencyModel');

class AppSettingsModel extends Model {}
AppSettingsModel.init({
  appCode: { type: Sequelize.STRING(3), primaryKey: true },
  baseCurrency: Sequelize.STRING(3),
  currencyConversionAPIKey: Sequelize.STRING(50)
}, {
  tableName: 'appsettings',
  createdAt: false,
  updatedAt: false,
  sequelize
});

AppSettingsModel.belongsTo(CurrencyModel, {
  as: "currency",
  foreignKey: 'baseCurrency'
});

module.exports = AppSettingsModel;
