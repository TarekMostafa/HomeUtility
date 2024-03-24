const Sequelize = require('sequelize');
const sequelize = require('../../db/dbConnection').getSequelize();
const ExpenseModel = require('../expenseHeader/expenseModel');
const ExpenseTypeModel = require('../expenseType/expenseTypeModel');
const CurrencyModel = require('../../currencies/currencyModel');

class ExpenseDetailModel extends Sequelize.Model {}
ExpenseDetailModel.init({
  expenseDetailId: { type: Sequelize.BIGINT(20), primaryKey: true, autoIncrement: true},
  expenseId: Sequelize.INTEGER(11),
  expenseDay: Sequelize.SMALLINT(2),
  expenseAmount: Sequelize.DECIMAL(18, 3),
  expenseCurrency: Sequelize.STRING(3),
  expenseDescription: Sequelize.STRING(250),
  expenseTypeId: { type: Sequelize.INTEGER, allowNull: true},
  expenseAdjusment: Sequelize.BOOLEAN,
  expenseDate: Sequelize.DATEONLY,
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

ExpenseDetailModel.belongsTo(CurrencyModel, {
  as: "currency",
  foreignKey: 'expenseCurrency'
});

module.exports = ExpenseDetailModel;
