const { Model } = require('sequelize');
const Sequelize = require('sequelize');
const sequelize = require('../../db/dbConnection').getSequelize();
const AccountModel = require('../accounts/accountModel');
const TransactionTypeModel = require('../transactionTypes/transactionTypeModel');
const RelatedTransactionModel = require('../relatedTransactions/relatedTransactionModel');

class TransactionModel extends Model {}
TransactionModel.init({
  transactionId: { type: Sequelize.BIGINT(20), primaryKey: true, autoIncrement: true},
  transactionAmount: Sequelize.DECIMAL(18, 3),
  transactionNarrative: Sequelize.STRING(200),
  transactionPostingDate: Sequelize.DATE,
  transactionCRDR: Sequelize.ENUM('Credit', 'Debit'),
  transactionAccount: { type: Sequelize.INTEGER },
  transactionTypeId: Sequelize.INTEGER,
  transactionRelatedTransactionId: Sequelize.BIGINT(20),
  transactionModule: { type: Sequelize.STRING(3), allowNull: true },
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
TransactionModel.belongsTo(RelatedTransactionModel, {
  as: "relatedtransaction",
  foreignKey: 'transactionRelatedTransactionId'
});

module.exports = TransactionModel;
