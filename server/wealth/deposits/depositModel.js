const Sequelize = require('sequelize');
const sequelize = require('../../db/dbConnection').getSequelize();
const BankModel = require('../banks/bankModel');
const CurrencyModel = require('../../currencies/CurrencyModel');
const AccountModel = require('../accounts/AccountModel');

class DepositModel extends Sequelize.Model {}
DepositModel.init({
  id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
  reference: Sequelize.STRING(30),
  amount: Sequelize.DECIMAL(18, 3),
  status: Sequelize.ENUM('ACTIVE', 'CLOSED'),
  rate: Sequelize.DECIMAL(18, 7),
  bankCode: Sequelize.STRING(3),
  accountId: Sequelize.INTEGER,
  currencyCode: Sequelize.STRING(3),
  startDate: Sequelize.DATEONLY,
  endDate: Sequelize.DATEONLY,
  releaseDate: { type: Sequelize.DATEONLY, allowNull: true},
  originalTransId: { type: Sequelize.BIGINT(20), allowNull: true },
  relatedId: { type: Sequelize.BIGINT(20), allowNull: true },
  interestTransType: { type: Sequelize.INTEGER, allowNull: true },
  releaseTransId: { type: Sequelize.BIGINT(20), allowNull: true },
}, {
  tableName: 'deposits',
  createdAt: false,
  updatedAt: false,
  sequelize
});

DepositModel.belongsTo(BankModel, {
  as: "bank",
  foreignKey: 'bankCode'
});

DepositModel.belongsTo(CurrencyModel, {
  as: "currency",
  foreignKey: 'currencyCode'
});

DepositModel.belongsTo(AccountModel, {
  as: "account",
  foreignKey: 'accountId'
});

module.exports = DepositModel;
