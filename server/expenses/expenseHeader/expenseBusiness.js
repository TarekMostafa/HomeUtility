const ExpenseRepo = require('./expenseRepo');
const Exception = require('../../features/exception');

class expenseBusiness {
  async getExpenses({year}) {
    return await ExpenseRepo.getExpenses({year});
  }

  async addExpense({year,month,currency, openBalance}) {
    var expenses = await ExpenseRepo.getExpenses({year, month, currency});
    if(expenses && expenses.length) throw new Exception('EXP_EXIST');
    return await ExpenseRepo.addExpense({
        expenseYear: year,
        expenseMonth: month,
        expenseCurrency: currency,
        expenseOpenBalance: openBalance,
        expenseCloseBalance: openBalance
    });
  }

//   async updateExpenseType(id, expenseType) {
//     const _expenseType = await ExpenseTypeRepo.getExpenseType(id);
//     if(!_expenseType) {
//       throw new Exception('EXP_TYP_NOT_EXIST');
//     }
//     _expenseType.typeName = expenseType.typeName;
//     return await _expenseType.save();
//   }

//   async deleteExpenseType(id) {
//     const _expenseType = await ExpenseTypeRepo.getExpenseType(id);
//     if(!_expenseType) {
//       throw new Exception('EXP_TYP_NOT_EXIST');
//     }
//     await _expenseType.destroy();
//     return true;
//   }
}

module.exports = expenseBusiness;
