const ExpenseTypeRepo = require('./expenseTypeRepo');
const Exception = require('../../features/exception');

class expenseTypeBusiness {
  async getExpenseTypes() {
    let expTypes = await ExpenseTypeRepo.getExpenseTypes();
    expTypes = expTypes.map(expType => {
      return {
        expenseTypeId: expType.expenseTypeId,
        expenseTypeName: expType.expenseTypeName,
      }
    })
    return expTypes;
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
