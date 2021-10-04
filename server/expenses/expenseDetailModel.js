const Sequelize = require('sequelize');
const sequelize = require('../db/dbConnection').getSequelize();
const ExpenseModel = require('./expenseModel');
const ExpenseTypeModel = require('./expenseTypeModel');

class ExpenseDetailModel extends Sequelize.Model {}
ExpenseDetailModel.init({
  expenseDetailId: { type: Sequelize.BIGINT(20), primaryKey: true, autoIncrement: true},
  expenseId: Sequelize.BIGINT(20),
  expenseDay: Sequelize.SMALLINT(2),
  expenseAmount: Sequelize.DECIMAL(18, 3),
  expenseCurrency: Sequelize.STRING(3),
  expenseDescription: Sequelize.STRING(250),
  expenseTypeId: Sequelize.INTEGER,
  expenseAdjusment: Sequelize.ENUM('YES', 'NO')
}, {
  tableName: 'expensesDetails',
  createdAt: false,
  updatedAt: false,
  sequelize
});

ExpenseDetailModel.belongsTo(ExpenseModel, {
    as: "expense",
    foreignKey: 'expenseId'
});

ExpenseDetailModel.belongsTo(ExpenseTypeModel, {
    as: "expenseType",
    foreignKey: 'expenseTypeId'
});

module.exports = ExpenseDetailModel;
