const Sequelize = require('sequelize');
const sequelize = require('../db/dbConnection').getSequelize();
const ExpenseTypeModel = require('./expenseTypeModel');

class ExpenseTypeLimitModel extends Sequelize.Model {}
ExpenseTypeLimitModel.init({
  expenseTypeLimitId: { type: Sequelize.BIGINT(20), primaryKey: true, autoIncrement: true},
  expenseYearMonth: Sequelize.STRING(6),
  expenseTypeId: Sequelize.INTEGER,
  expenseLimit: Sequelize.DECIMAL(18, 3),
  expenseCurrency: Sequelize.STRING(3)
}, {
  tableName: 'expenseTypes',
  createdAt: false,
  updatedAt: false,
  sequelize
});

ExpenseTypeLimitModel.belongsTo(ExpenseTypeModel, {
    as: "expenseType",
    foreignKey: 'expenseTypeId'
});

module.exports = ExpenseTypeLimitModel;