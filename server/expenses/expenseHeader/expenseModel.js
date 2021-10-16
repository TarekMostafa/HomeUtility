const Sequelize = require('sequelize');
const sequelize = require('../../db/dbConnection').getSequelize();

class ExpenseModel extends Sequelize.Model {}
ExpenseModel.init({
  expenseId: { type: Sequelize.INTEGER(11), primaryKey: true, autoIncrement: true},
  expenseYear: Sequelize.NUMBER(4),
  expenseMonth: Sequelize.NUMBER(2),
  expenseCurrency: Sequelize.STRING(3),
  expenseOpenBalance: Sequelize.DECIMAL(18, 3),
  expenseCloseBalance: Sequelize.DECIMAL(18, 3),
}, {
  tableName: 'expenses',
  createdAt: false,
  updatedAt: false,
  sequelize
});

module.exports = ExpenseModel;
