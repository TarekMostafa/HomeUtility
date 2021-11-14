const Sequelize = require('sequelize');
const sequelize = require('../../db/dbConnection').getSequelize();
const CurrencyModel = require('../../currencies/currencyModel');

class ExpenseModel extends Sequelize.Model {}
ExpenseModel.init({
  expenseId: { type: Sequelize.INTEGER(11), primaryKey: true, autoIncrement: true},
  expenseYear: Sequelize.NUMBER(4),
  expenseMonth: Sequelize.NUMBER(2),
  expenseCurrency: Sequelize.STRING(3),
  expenseOpenBalance: Sequelize.DECIMAL(18, 3),
  expenseCloseBalance: Sequelize.DECIMAL(18, 3),
  expenseDebits: Sequelize.DECIMAL(18, 3),
  expenseAdjusments: Sequelize.DECIMAL(18, 3),
  totalAccountsDebitTrans: Sequelize.DECIMAL(18, 3),
  allowedDebitTransTypes: Sequelize.STRING(200),
  extractedDebitTransTypes: Sequelize.STRING(200)
}, {
  tableName: 'expenses',
  createdAt: false,
  updatedAt: false,
  sequelize
});

ExpenseModel.belongsTo(CurrencyModel, {
  as: "currency",
  foreignKey: 'expenseCurrency'
});

module.exports = ExpenseModel;
