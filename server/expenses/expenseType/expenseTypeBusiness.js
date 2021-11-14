const ExpenseTypeRepo = require('./expenseTypeRepo');
const Exception = require('../../features/exception');

class expenseTypeBusiness {
  async getExpenseTypes() {
    return await ExpenseTypeRepo.getExpenseTypes();
  }

  async addExpenseType({expenseTypeName}) {
    return await ExpenseTypeRepo.addExpenseType({expenseTypeName});
  }

  async updateExpenseType(id, {expenseTypeName}) {
    const expenseType = await ExpenseTypeRepo.getExpenseType(id);
    if(!expenseType) {
      throw new Exception('EXP_TYP_NOT_EXIST');
    }
    expenseType.expenseTypeName = expenseTypeName;
    return await expenseType.save();
  }

  async deleteExpenseType(id) {
    const expenseType = await ExpenseTypeRepo.getExpenseType(id);
    if(!expenseType) {
      throw new Exception('EXP_TYP_NOT_EXIST');
    }
    return await expenseType.destroy();
  }
}

module.exports = expenseTypeBusiness;
