const ExpenseRepo = require('./expenseRepo');
const Exception = require('../../features/exception');
const TransactionRepo = require('../../wealth/transactions/transactionRepo');
const AmountHelper = require('../../helper/AmountHelper');

class expenseBusiness {
  async getExpenses({year}) {
    let expenses = await ExpenseRepo.getExpenses({year});
    expenses = await Promise.all(expenses.map( async expense => {

      let sumOfAccountDebits = 0;
      if(expense.expenseDebitTransTypes) {
        let dateFrom = new Date(expense.expenseYear, expense.expenseMonth-1, 1);
        let dateTo   = new Date(expense.expenseYear, expense.expenseMonth, 1);
        dateTo.setDate(0);
    
        sumOfAccountDebits = await TransactionRepo.getSumTransactions(
          expense.expenseDebitTransTypes.split(','),
          expense.expenseCurrency,
          dateFrom,
          dateTo
        );
      }

      return this.getExpenseObject(expense, Math.abs(sumOfAccountDebits));

    }));
    return expenses;
  }

  async getExpense(id) {
    let expense = await ExpenseRepo.getExpense(id);
    if (!expense) throw new Exception('EXP_HEAD_NOTEXIST');

    let sumOfAccountDebits = 0;
    if(expense.expenseDebitTransTypes) {
      let dateFrom = new Date(expense.expenseYear, expense.expenseMonth-1, 1);
      let dateTo   = new Date(expense.expenseYear, expense.expenseMonth, 1);
      dateTo.setDate(0);
  
      sumOfAccountDebits = await TransactionRepo.getSumTransactions(
        expense.expenseDebitTransTypes.split(','),
        expense.expenseCurrency,
        dateFrom,
        dateTo
      );
    }

    return this.getExpenseObject(expense, Math.abs(sumOfAccountDebits));
  }

  getExpenseObject(expense, sumOfAccountDebits) {
    return {
      expenseId: expense.expenseId,
      expenseYear: expense.expenseYear,
      expenseMonth: expense.expenseMonth,
      expenseCurrency: expense.expenseCurrency,
      expenseOpenBalance: expense.expenseOpenBalance,
      expenseOpenBalanceFormatted: AmountHelper.formatAmount(expense.expenseOpenBalance, 
        expense.currency.currencyDecimalPlace),
      expenseCalculatedBalance: expense.expenseCalculatedBalance,
      expenseCalculatedBalanceFormatted: AmountHelper.formatAmount(expense.expenseCalculatedBalance, 
        expense.currency.currencyDecimalPlace),
      expenseDebits: expense.expenseDebits,
      expenseDebitsFormatted: AmountHelper.formatAmount(expense.expenseDebits, 
        expense.currency.currencyDecimalPlace),
      expenseAdjusments: expense.expenseAdjusments,
      expenseAdjusmentsFormatted: AmountHelper.formatAmount(expense.expenseAdjusments, 
        expense.currency.currencyDecimalPlace),
      expenseTotalAccountDebit: expense.expenseTotalAccountDebit,
      expenseTotalAccountDebitFormatted: AmountHelper.formatAmount(expense.expenseTotalAccountDebit, 
        expense.currency.currencyDecimalPlace),
      expenseDebitTransTypes: expense.expenseDebitTransTypes,
      expenseCloseBalance: expense.expenseCloseBalance,
      expenseCloseBalanceFormatted: AmountHelper.formatAmount(expense.expenseCloseBalance, 
        expense.currency.currencyDecimalPlace),
      expenseStatus: expense.expenseStatus,
      currency: {
        currencyDecimalPlace: expense.currency.currencyDecimalPlace,
      },
      expenseRealAccountDebits: sumOfAccountDebits,
      expenseRealAccountDebitsFormatted: 
        AmountHelper.formatAmount(sumOfAccountDebits, expense.currency.currencyDecimalPlace),
      expenseDifferenceAccountDebits: (sumOfAccountDebits-expense.expenseTotalAccountDebit),
      expenseDifferenceAccountDebitsFormatted: AmountHelper.formatAmount(
        (sumOfAccountDebits-expense.expenseTotalAccountDebit), expense.currency.currencyDecimalPlace),
    }
  }

  async addExpense({year,month,currency, openBalance, allowedDebitTransTypeIds, 
    extractedDebitTransTypeIds}) {
    var expenses = await ExpenseRepo.getExpenses({year, month, currency});
    if(expenses && expenses.length) throw new Exception('EXP_EXIST');
    return await ExpenseRepo.addExpense({
        expenseYear: year,
        expenseMonth: month,
        expenseCurrency: currency,
        expenseOpenBalance: openBalance,
        expenseCalculatedBalance: openBalance,
        expenseDebitTransTypes: allowedDebitTransTypeIds?allowedDebitTransTypeIds:null,
        expenseCloseBalance: 0,
        expenseStatus: 'ACTIVE',
    });
  }

  async updateExpense(id, {openBalance, allowedDebitTransTypeIds, expenseStatus}) {
    await ExpenseRepo.updateExpense(id, {openBalance, allowedDebitTransTypeIds, 
      expenseStatus});
  }

  async updateTotalAccountDebit(id, {diffAmount}){
    await ExpenseRepo.updateTotalAccountDebit(id, diffAmount);
  }

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
