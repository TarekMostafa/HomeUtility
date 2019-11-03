const Sequelize = require('sequelize');
const sequelize = require('../../db/dbConnection').getSequelize();
const BankModel = require('../banks/bankModel');
const CurrencyModel = require('../../currencies/CurrencyModel');

class AccountModel extends Sequelize.Model {}
AccountModel.init({
  accountId: { type: Sequelize.INTEGER, primaryKey: true },
  accountNumber: Sequelize.STRING(20),
  accountCurrentBalance: Sequelize.DECIMAL(18, 3),
  accountLastBalanceUpdate: { type: Sequelize.DATE, allowNull: true},
  accountStartBalance: Sequelize.DECIMAL(18, 3),
  accountStatus: Sequelize.ENUM('ACTIVE', 'CLOSED'),
  accountBankCode: Sequelize.STRING(3),
  accountCurrency: Sequelize.STRING(3),
  accountUser: Sequelize.INTEGER,
}, {
  tableName: 'accounts',
  createdAt: false,
  updatedAt: false,
  sequelize
});

AccountModel.belongsTo(BankModel, {
  as: "bank",
  foreignKey: 'accountBankCode'
});

AccountModel.belongsTo(CurrencyModel, {
  as: "currency",
  foreignKey: 'accountCurrency'
});

module.exports = AccountModel;
