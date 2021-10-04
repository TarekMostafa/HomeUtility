const ExpenseTypeRepo = require('./expenseTypeRepo');
const Exception = require('../features/exception');

class expenseTypeBusiness {
  async getExpenseTypes() {
    return await ExpenseTypeRepo.getExpenseTypes();
  }

  async addExpenseType(expenseType) {
    return await ExpenseTypeRepo.addExpenseType(expenseType);
  }

  async updateExpenseType(id, expenseType) {
    const _expenseType = await ExpenseTypeRepo.getExpenseType(id);
    if(!_expenseType) {
      throw new Exception('EXP_TYP_NOT_EXIST');
    }
    _expenseType.typeName = expenseType.typeName;
    return await _expenseType.save();
  }

  async deleteExpenseType(id) {
    const _expenseType = await ExpenseTypeRepo.getExpenseType(id);
    if(!_expenseType) {
      throw new Exception('EXP_TYP_NOT_EXIST');
    }
    await _expenseType.destroy();
    return true;
  }
}

module.exports = expenseTypeBusiness;
