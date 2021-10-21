const sequelize = require('../../db/dbConnection').getSequelize();
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
    let dbTransaction;
    try {
      dbTransaction = await sequelize.transaction();
      await ExpenseDetailRepo.addExpenseDetail({
          expenseId,
          expenseDay,
          expenseAmount,
          expenseCurrency: expense.expenseCurrency,
          expenseDescription,
          expenseTypeId,
          expenseAdjusment
      }, dbTransaction);
      await ExpenseRepo.increaseExpenseBalances(expenseId, expenseAmount, expenseAdjusment, dbTransaction);
      await dbTransaction.commit();
    } catch (err) {
      console.log(`error ${err}`);
      await dbTransaction.rollback();
      throw new Exception('EXP_ADD_FAIL');
    }
  }

  async deleteExpenseDetail(id) {
    const _expenseDetail = await ExpenseDetailRepo.getExpenseDetail(id);
    if(!_expenseDetail) throw new Exception('EXP_DET_NOTEXIST');

    let dbTransaction;
    try {
      dbTransaction = await sequelize.transaction();
      await ExpenseRepo.decreaseExpenseBalances(_expenseDetail.expenseId, 
        _expenseDetail.expenseAmount, 
        _expenseDetail.expenseAdjusment, dbTransaction);
      await _expenseDetail.destroy({transaction: dbTransaction});
      await dbTransaction.commit();
    } catch (err) {
      console.log(`error ${err}`);
      await dbTransaction.rollback();
      throw new Exception('EXP_DELETE_FAIL');
    }
  }
}

module.exports = expenseDetailBusiness;
