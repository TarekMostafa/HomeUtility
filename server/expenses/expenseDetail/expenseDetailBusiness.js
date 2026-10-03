const Sequelize = require('sequelize');
const sequelize = require('../../db/dbConnection').getSequelize();
const ExpenseDetailRepo = require('./expenseDetailRepo');
const ExpenseRepo = require('../expenseHeader/expenseRepo');
const Exception = require('../../features/exception');
const AmountHelper = require('../../helper/AmountHelper');
const BillRepo = require('../../bills/billRepo');
const BillTransactionRepo = require('../../bills/billTransactionRepo');
const Common = require('../../utilities/common');

const Op = Sequelize.Op;

class expenseDetailBusiness {
  async getExpensesDetails({description, includeDescription, expDateFrom, expDateTo,
    expIsAdjusment, expTypes, skip, limit, label1, label2, label3, label4, label5, expCurrency}){
    limit = Common.getNumber(limit, 10);
    skip = Common.getNumber(skip, 0);
      
    let query = {};
    // Description
    if(description) {
      if(includeDescription==='true') {
        query.expenseDescription = {
          [Op.substring] : description
        }
      } else {
        query.expenseDescription = {
          [Op.notLike] : '%'+description.trim()+'%'
        }
      }
    }
    // Check expense Date from and expense Date To
    let _dateFrom = Common.getDate(expDateFrom, '');
    let _dateTo = Common.getDate(expDateTo, '');
    if( _dateFrom !== '' && _dateTo !== '') {
      query.expenseDate = { [Op.between] : [_dateFrom, _dateTo] };
    } else {
      if(_dateFrom !== '') {
        query.expenseDate = { [Op.gte] : _dateFrom };
      } else if(_dateTo !== '') {
        query.expenseDate = { [Op.lte] : _dateTo };
      }
    }
    //Adjusment
    if(['Y', 'y'].indexOf(expIsAdjusment) > -1) query.expenseAdjusment = 1;
    else if(['N', 'n'].indexOf(expIsAdjusment) > -1) query.expenseAdjusment = 0;
    //Expense Type
    if(expTypes) {
      query.expenseTypeId = expTypes;
    }
    //Labels
    if(label1) query.expenseLabel1 = label1;
    if(label2) query.expenseLabel2 = label2;
    if(label3) query.expenseLabel3 = label3;
    if(label4) query.expenseLabel4 = label4;
    if(label5) query.expenseLabel5 = label5;
    //Currency
    if(expCurrency) query.expenseCurrency = expCurrency;

    let expensesDetailsCount = -1
    if(skip===0)
      expensesDetailsCount = await ExpenseDetailRepo.getExpensesDetailsCount(query);
    let expensesDetails = await ExpenseDetailRepo.getExpensesDetails({skip, limit, query});
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
        expenseBillTransId: expDet.expenseBillTransId,
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
    return {
      totalCount: expensesDetailsCount,
      expensesDetails
    };
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
        expenseBillTransId: expDet.expenseBillTransId,
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

  async getExpenseDetail(id) {
    let expenseDetail = await ExpenseDetailRepo.getExpenseDetail(id);
    expenseDetail = {
      expenseDetailId: expenseDetail.expenseDetailId,
      expenseId: expenseDetail.expenseId,
      expenseDay: expenseDetail.expenseDay,
      expenseAmount: expenseDetail.expenseAmount,
      expenseAmountFormatted: AmountHelper.formatAmount(expenseDetail.expenseAmount, 
          expenseDetail.currency.currencyDecimalPlace),
      expenseCurrency: expenseDetail.expenseCurrency,
      expenseDescription: expenseDetail.expenseDescription,
      expenseTypeId: expenseDetail.expenseTypeId,
      expenseAdjusment: expenseDetail.expenseAdjusment,
      expenseDate: expenseDetail.expenseDate,
      expenseLabel1: expenseDetail.expenseLabel1,
      expenseLabel2: expenseDetail.expenseLabel2,
      expenseLabel3: expenseDetail.expenseLabel3,
      expenseLabel4: expenseDetail.expenseLabel4,
      expenseLabel5: expenseDetail.expenseLabel5,
      expenseBillTransId: expenseDetail.expenseBillTransId,
      currencyDecimalPlace: expenseDetail.currency.currencyDecimalPlace,
    }
    return expenseDetail;
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
    //if(expense.expenseStatus === 'CLOSED') throw new Exception('EXP_STATUS_CLOSED');

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
    //if(expense.expenseStatus === 'CLOSED') throw new Exception('EXP_STATUS_CLOSED');

    expenseDetail.expenseLabel1 = expenseLabel1? expenseLabel1:null;
    expenseDetail.expenseLabel2 = expenseLabel2? expenseLabel2:null;
    expenseDetail.expenseLabel3 = expenseLabel3? expenseLabel3:null;
    expenseDetail.expenseLabel4 = expenseLabel4? expenseLabel4:null;
    expenseDetail.expenseLabel5 = expenseLabel5? expenseLabel5:null;
    await expenseDetail.save();
  }

  async addExpenseDetailToBillTransaction(id, {billId, billTransId}) {
    let expenseDetail = await ExpenseDetailRepo.getExpenseDetail(id);
    if(!expenseDetail) throw new Exception('EXP_DET_NOTEXIST');

    let expense = await ExpenseRepo.getExpense(expenseDetail.expenseId);
    if(!expense) throw new Exception('EXP_HEAD_NOTEXIST');

    let bill = await BillRepo.getBill(billId);
    if(!bill) throw new Exception('BILL_NOT_EXIST');

    let isBillTransExist = false;
    let billTrans = null;
    if(billTransId) {
      billTrans = await BillTransactionRepo.getBillTransaction(billTransId);
      if (!billTrans) throw new Exception('BILLTRANS_NOT_EXIST');
      else isBillTransExist = true;
    }

    const expDetDate = new Date(expense.expenseYear, 
      expense.expenseMonth-1,
      expenseDetail.expenseDay
    );

    let amountType = "";
    if (expenseDetail.expenseAdjusment) {
      amountType = (expenseDetail.expenseAmount > 0? "Credit":"Debit");
    } else {
      amountType = (expenseDetail.expenseAmount > 0? "Debit":"Credit");
    }

    let dbTransaction;
    try{
      dbTransaction = await sequelize.transaction();
      if(isBillTransExist) {
        await BillTransactionRepo.updateBillTransactionExternalId(
          billTrans, 'EXP', expenseDetail.expenseDetailId, dbTransaction
        )
        expenseDetail.expenseBillTransId = billTransId;
        await expenseDetail.save({transaction: dbTransaction});
      } else {
        const savedBillTrans = await BillTransactionRepo.addBillTransaction({
          transAmount: expenseDetail.expenseAmount,
          transBillDate: expDetDate,
          transNotes: expenseDetail.expenseDescription,
          transOutOfFreq: true,
          transAmountType: amountType,
          billId: bill.billId,
          transPostingDate: expDetDate,
          transCurrency: expenseDetail.expenseCurrency,
          transSource: 'EXP',
          transExternalId: expenseDetail.expenseDetailId,
          transReview: 1,
        }, dbTransaction);
        expenseDetail.expenseBillTransId = savedBillTrans.transId;
        await expenseDetail.save({transaction: dbTransaction});
      }
      await dbTransaction.commit();
    } catch (err) {
      console.log(err);
      await dbTransaction.rollback();
      throw new Exception('EXPDET_BILL_CREATE_FAIL');
    }
  }

  async updateBulkExpenseDetailLabel({expenseDetailIds, label, labelValue, forceUpdate}){
    if(!Array.isArray(expenseDetailIds) || expenseDetailIds.length < 1)
    {
      throw new Exception('INVALID_REQUEST');
    }
    
    const updateRecords = 
      await ExpenseDetailRepo.updateBulkExpenseDetailLabel(expenseDetailIds, label, labelValue, forceUpdate);
    return {
      numberOfUpdated: updateRecords[0]
    }
  }
}

module.exports = expenseDetailBusiness;
