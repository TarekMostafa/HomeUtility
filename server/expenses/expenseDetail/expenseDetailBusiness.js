const ExpenseDetailRepo = require('./expenseDetailRepo');
const ExpenseRepo = require('../expenseHeader/expenseRepo');
const Exception = require('../../features/exception');

class expenseDetailBusiness {
  async getExpenseDetails({expenseId}) {
    if(!expenseId) throw new Exception('EXP_ID_REQ');
    return await ExpenseDetailRepo.getExpenseDetails({expenseId});
  }

  async addExpenseDetail({expenseId, expenseDay, expenseAmount, expenseDescription, 
    expenseTypeId, expenseAdjusment}) {
    var expense = await ExpenseRepo.getExpense(expenseId);
    if(!expense) throw new Exception('EXP_HEAD_NOTEXIST');
    return await ExpenseDetailRepo.addExpenseDetail({
        expenseId,
        expenseDay,
        expenseAmount,
        expenseCurrency: expense.expenseCurrency,
        expenseDescription,
        expenseTypeId,
        expenseAdjusment
    });
  }

  async deleteExpenseDetail(id) {
    const _expenseDetail = await ExpenseDetailRepo.getExpenseDetail(id);
    if(!_expenseDetail) throw new Exception('EXP_DET_NOTEXIST');
    await _expenseDetail.destroy();
    return true;
  }
}

module.exports = expenseDetailBusiness;
