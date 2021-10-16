const Sequelize = require('sequelize');
const sequelize = require('../../db/dbConnection').getSequelize();

class ExpenseTypeModel extends Sequelize.Model {}
ExpenseTypeModel.init({
  expenseTypeId: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
  expenseTypeName: Sequelize.STRING(50)
}, {
  tableName: 'expenseTypes',
  createdAt: false,
  updatedAt: false,
  sequelize
});

module.exports = ExpenseTypeModel;