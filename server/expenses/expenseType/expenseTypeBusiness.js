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
    const _expenseType = await ExpenseTypeRepo.getExpenseType(id);
    if(!_expenseType) {
      throw new Exception('EXP_TYP_NOT_EXIST');
    }
    _expenseType.expenseTypeName = expenseTypeName;
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
