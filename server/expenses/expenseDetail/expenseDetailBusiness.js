const sequelize = require('../../db/dbConnection').getSequelize();
const ExpenseDetailRepo = require('./expenseDetailRepo');
const ExpenseRepo = require('../expenseHeader/expenseRepo');
const Exception = require('../../features/exception');

class expenseDetailBusiness {
  async getExpensesDetails({description, includeDescription, expDateFrom, expDateTo,
    expIsAdjusment, expTypes, skip, limit}){
    return await ExpenseDetailRepo.getExpensesDetails({description, includeDescription, expDateFrom, 
      expDateTo, expIsAdjusment, expTypes, skip, limit});
  }

  async getExpenseDetails({expenseId}) {
    if(!expenseId) throw new Exception('EXP_ID_REQ');
    return await ExpenseDetailRepo.getExpenseDetails({expenseId});
  }

  async addExpenseDetail({expenseId, expenseDay, expenseAmount, expenseDescription, 
    expenseTypeId, expenseAdjusment}) {
    let expense = await ExpenseRepo.getExpense(expenseId);
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
          expenseAdjusment,
          expenseDate: new Date(expense.expenseYear,expense.expenseMonth-1,expenseDay)
      }, dbTransaction);
      await ExpenseRepo.increaseExpenseBalances(expenseId, expenseAmount, expenseAdjusment, dbTransaction);
      await dbTransaction.commit();
    } catch (err) {
      console.log(`error ${err}`);
      await dbTransaction.rollback();
      throw new Exception('EXP_ADD_FAIL');
    }
  }

  async updateExpenseDetail(id, {expenseTypeId, expenseDescription}) {
    let expenseDetail = await ExpenseDetailRepo.getExpenseDetail(id);
    if(!expenseDetail) throw new Exception('EXP_DET_NOTEXIST');

    expenseDetail.expenseTypeId = expenseTypeId;
    expenseDetail.expenseDescription = expenseDescription;
    expenseDetail.save();
  }

  async deleteExpenseDetail(id) {
    const expenseDetail = await ExpenseDetailRepo.getExpenseDetail(id);
    if(!expenseDetail) throw new Exception('EXP_DET_NOTEXIST');

    let dbTransaction;
    try {
      dbTransaction = await sequelize.transaction();
      await ExpenseRepo.decreaseExpenseBalances(expenseDetail.expenseId, 
        expenseDetail.expenseAmount, 
        expenseDetail.expenseAdjusment, dbTransaction);
      await expenseDetail.destroy({transaction: dbTransaction});
      await dbTransaction.commit();
    } catch (err) {
      console.log(`error ${err}`);
      await dbTransaction.rollback();
      throw new Exception('EXP_DELETE_FAIL');
    }
  }
}

module.exports = expenseDetailBusiness;
