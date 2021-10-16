const ExpenseTypeModel = require('./expenseTypeModel');

class ExpenseTypeRepo {
  static async getExpenseTypes() {
    return await ExpenseTypeModel.findAll({
      attributes: ['expenseTypeId', 'expenseTypeName']
    });
  }

  static async getExpenseType(id) {
    return await ExpenseTypeModel.findByPk(id);
  }

  static async addExpenseType(expenseType) {
    await ExpenseTypeModel.build(expenseType).save();
  }
}

module.exports = ExpenseTypeRepo;
