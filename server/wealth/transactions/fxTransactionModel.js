const Sequelize = require('sequelize');
const sequelize = require('../../db/dbConnection').getSequelize();
const AccountModel = require('../accounts/accountModel');
const RelatedTransactionModel = require('../relatedTransactions/relatedTransactionModel');

class FxTransactionModel extends Sequelize.Model {}
FxTransactionModel.init({
  fxId: { type: Sequelize.BIGINT(20), primaryKey: true, autoIncrement: true},
  fxRelTransId: Sequelize.BIGINT(20),
  fxAmountFrom: Sequelize.DECIMAL(18, 3),
  fxAmountTo: Sequelize.DECIMAL(18, 3),
  fxPostingDate: Sequelize.DATEONLY,
  fxRate: Sequelize.DECIMAL(12, 7),
  fxAccountFrom: { type: Sequelize.INTEGER },
  fxAccountTo: { type: Sequelize.INTEGER },
  fxCurrencyFrom: Sequelize.STRING(3),
  fxCurrencyTo: Sequelize.STRING(3),
}, {
  tableName: 'fxtransactions',
  createdAt: false,
  updatedAt: false,
  sequelize
});

FxTransactionModel.belongsTo(AccountModel, {
  as: "accountFrom",
  foreignKey: 'fxAccountFrom'
});
FxTransactionModel.belongsTo(AccountModel, {
  as: "accountTo",
  foreignKey: 'fxAccountTo'
});
FxTransactionModel.belongsTo(RelatedTransactionModel, {
  as: "relatedtransaction",
  foreignKey: 'fxRelTransId'
});

module.exports = FxTransactionModel;
