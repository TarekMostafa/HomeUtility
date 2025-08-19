const sequelize = require('../../db/dbConnection').getSequelize();
const ExpenseDetailRepo = require('./expenseDetailRepo');
const ExpenseRepo = require('../expenseHeader/expenseRepo');
const Exception = require('../../features/exception');
const AmountHelper = require('../../helper/AmountHelper');

class expenseDetailBusiness {
  async getExpensesDetails({description, includeDescription, expDateFrom, expDateTo,
    expIsAdjusment, expTypes, skip, limit, label1, label2, label3, label4, label5}){
    let expensesDetails = await ExpenseDetailRepo.getExpensesDetails({description, includeDescription, expDateFrom, 
      expDateTo, expIsAdjusment, expTypes, skip, limit, label1, label2, label3, label4, label5});
    expensesDetails = expensesDetails.map( expDet => {
      return {
        expenseDetailId: expDet.expenseDetailId,
        expenseId: expDet.expenseId,
        expenseDay: expDet.expenseDay,
        expenseAmount: expDet.expenseAmount,
        expenseAmountFormatted: AmountHelper.formatAmount(expDet.expenseAmount, 
          expDet.currency.currencyDecimalPlace),
        expenseCurrency: expDet.expenseCurrency,
        expenseDescription: expDet.expenseDescription,
        expenseTypeId: expDet.expenseTypeId,
        expenseAdjusment: expDet.expenseAdjusment,
        expenseDate: expDet.expenseDate,
        expenseLabels: {
          expenseLabel1: expDet.expenseLabel1,
          expenseLabel2: expDet.expenseLabel2,
          expenseLabel3: expDet.expenseLabel3,
          expenseLabel4: expDet.expenseLabel4,
          expenseLabel5: expDet.expenseLabel5,
        },
        expenseType: {
          expenseTypeId: expDet.expenseType?expDet.expenseType.expenseTypeId:'',
          expenseTypeName: expDet.expenseType?expDet.expenseType.expenseTypeName:'',
        },
        currency: {
          currencyDecimalPlace: expDet.currency.currencyDecimalPlace
        },
        expense: {
          expenseId: expDet.expense.expenseId,
          expenseYear: expDet.expense.expenseYear,
          expenseMonth: expDet.expense.expenseMonth,
          expenseCurrency: expDet.expense.expenseCurrency,
          expenseOpenBalance: expDet.expense.expenseOpenBalance,
          expenseCalculatedBalance: expDet.expense.expenseCalculatedBalance,
          expenseDebits: expDet.expense.expenseDebits,
          expenseAdjusments: expDet.expense.expenseAdjusments,
          expenseTotalAccountDebit: expDet.expense.expenseTotalAccountDebit,
          expenseDebitTransTypes: expDet.expense.expenseDebitTransTypes,
        }
      }
    });
    return expensesDetails;
  }

  async getExpenseDetails({expenseId}) {
    if(!expenseId) throw new Exception('EXP_ID_REQ');
    let expenseDetails = await ExpenseDetailRepo.getExpenseDetails({expenseId});
    expenseDetails = expenseDetails.map( expDet => {
      return {
        expenseDetailId: expDet.expenseDetailId,
        expenseId: expDet.expenseId,
        expenseDay: expDet.expenseDay,
        expenseAmount: expDet.expenseAmount,
        expenseAmountFormatted: AmountHelper.formatAmount(expDet.expenseAmount, 
          expDet.currency.currencyDecimalPlace),
        expenseCurrency: expDet.expenseCurrency,
        expenseDescription: expDet.expenseDescription,
        expenseTypeId: expDet.expenseTypeId,
        expenseAdjusment: expDet.expenseAdjusment,
        expenseDate: expDet.expenseDate,
        expenseLabels: {
          expenseLabel1: expDet.expenseLabel1,
          expenseLabel2: expDet.expenseLabel2,
          expenseLabel3: expDet.expenseLabel3,
          expenseLabel4: expDet.expenseLabel4,
          expenseLabel5: expDet.expenseLabel5,
        },
        expenseType: {
          expenseTypeId: expDet.expenseType?expDet.expenseType.expenseTypeId:'',
          expenseTypeName: expDet.expenseType?expDet.expenseType.expenseTypeName:'',
        },
        currency: {
          currencyDecimalPlace: expDet.currency.currencyDecimalPlace
        },
        expense: {
          expenseId: expDet.expense.expenseId,
          expenseYear: expDet.expense.expenseYear,
          expenseMonth: expDet.expense.expenseMonth,
          expenseCurrency: expDet.expense.expenseCurrency,
          expenseOpenBalance: expDet.expense.expenseOpenBalance,
          expenseCalculatedBalance: expDet.expense.expenseCalculatedBalance,
          expenseDebits: expDet.expense.expenseDebits,
          expenseAdjusments: expDet.expense.expenseAdjusments,
          expenseTotalAccountDebit: expDet.expense.expenseTotalAccountDebit,
          expenseDebitTransTypes: expDet.expense.expenseDebitTransTypes,
        }
      }
    })
    return expenseDetails;
  }

  async addExpenseDetail({expenseId, expenseDay, expenseAmount, expenseDescription, 
    expenseTypeId, expenseAdjusment}) {
    let expense = await ExpenseRepo.getExpense(expenseId);
    if(!expense) throw new Exception('EXP_HEAD_NOTEXIST');
    if(expense.expenseStatus === 'CLOSED') throw new Exception('EXP_STATUS_CLOSED');
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

    let expense = await ExpenseRepo.getExpense(expenseDetail.expenseId);
    if(!expense) throw new Exception('EXP_HEAD_NOTEXIST');
    if(expense.expenseStatus === 'CLOSED') throw new Exception('EXP_STATUS_CLOSED');

    expenseDetail.expenseTypeId = expenseTypeId;
    expenseDetail.expenseDescription = expenseDescription;
    await expenseDetail.save();
  }

  async deleteExpenseDetail(id) {
    const expenseDetail = await ExpenseDetailRepo.getExpenseDetail(id);
    if(!expenseDetail) throw new Exception('EXP_DET_NOTEXIST');

    let expense = await ExpenseRepo.getExpense(expenseDetail.expenseId);
    if(!expense) throw new Exception('EXP_HEAD_NOTEXIST');
    if(expense.expenseStatus === 'CLOSED') throw new Exception('EXP_STATUS_CLOSED');

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

  async updateExpenseDetailLabels(id, {expenseLabel1, expenseLabel2, expenseLabel3, 
    expenseLabel4, expenseLabel5}) {
    let expenseDetail = await ExpenseDetailRepo.getExpenseDetail(id);
    if(!expenseDetail) throw new Exception('EXP_DET_NOTEXIST');

    let expense = await ExpenseRepo.getExpense(expenseDetail.expenseId);
    if(!expense) throw new Exception('EXP_HEAD_NOTEXIST');
    if(expense.expenseStatus === 'CLOSED') throw new Exception('EXP_STATUS_CLOSED');

    expenseDetail.expenseLabel1 = expenseLabel1? expenseLabel1:null;
    expenseDetail.expenseLabel2 = expenseLabel2? expenseLabel2:null;
    expenseDetail.expenseLabel3 = expenseLabel3? expenseLabel3:null;
    expenseDetail.expenseLabel4 = expenseLabel4? expenseLabel4:null;
    expenseDetail.expenseLabel5 = expenseLabel5? expenseLabel5:null;
    await expenseDetail.save();
  }
}

module.exports = expenseDetailBusiness;
