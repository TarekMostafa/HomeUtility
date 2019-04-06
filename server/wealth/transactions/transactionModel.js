const { Model } = require('sequelize');
const Sequelize = require('sequelize');
const sequelize = require('../../db/dbConnection');
const AccountModel = require('../accounts/accountModel');
const TransactionTypeModel = require('../transactionTypes/transactionTypeModel');

class TransactionModel extends Model {}
TransactionModel.init({
  transactionId: { type: Sequelize.BIGINT(20), primaryKey: true },
  transactionAmount: Sequelize.DECIMAL(18, 3),
  transactionNarrative: Sequelize.STRING(200),
  transactionPostingDate: Sequelize.DATE,
  transactionCRDR: Sequelize.ENUM('Credit', 'Debit'),
  transactionAccount: { type: Sequelize.INTEGER },
  transactionTypeId: Sequelize.INTEGER,
  transactionRelatedTransactionId: Sequelize.BIGINT(20),
}, {
  tableName: 'transactions',
  createdAt: false,
  updatedAt: false,
  sequelize
});

TransactionModel.belongsTo(AccountModel, {
  as: "account",
  foreignKey: 'transactionAccount'
});
TransactionModel.belongsTo(TransactionTypeModel, {
  as: "transactionType",
  foreignKey: 'transactionTypeId'
});

module.exports = TransactionModel;
