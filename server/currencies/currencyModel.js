const Sequelize = require('sequelize');
const sequelize = require('../db/dbConnection').getSequelize();

class CurrencyModel extends Sequelize.Model {}
CurrencyModel.init({
  currencyCode: { type: Sequelize.STRING(3), primaryKey: true },
  currencyName: Sequelize.STRING(45),
  currencyActive: Sequelize.ENUM('YES', 'NO'),
  currencyRateAgainstBase: Sequelize.DECIMAL(18, 7),
  currencyDecimalPlace: Sequelize.TINYINT
}, {
  tableName: 'currencies',
  createdAt: false,
  updatedAt: false,
  sequelize
});

module.exports = CurrencyModel;
