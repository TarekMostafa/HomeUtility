const ExpenseModel = require('./expenseModel');
const sequelize = require('../../db/dbConnection').getSequelize();
const CurrencyModel = require('../../currencies/currencyModel');

class ExpenseRepo {
  static async getExpenses({year, month, currency}) {
    var query = {};
    if(year) query.expenseYear = year;
    if(month) query.expenseMonth = month;
    if(currency) query.expenseCurrency = currency;
    return await ExpenseModel.findAll({
      include: [
        { model: CurrencyModel, as: 'currency', attributes: ['currencyDecimalPlace'] },
      ],
      where: query,
      order: [ ['expenseYear', 'DESC'] , ['expenseMonth', 'DESC'] ]
    });
  }

  static async getExpense(id) {
    return await ExpenseModel.findByPk(id, {
      include: [
        { model: CurrencyModel, as: 'currency', attributes: ['currencyDecimalPlace'] },
      ]
    });
  }

  static async addExpense(expense) {
    await ExpenseModel.build(expense).save();
  }

  static async increaseExpenseBalances(id, amount, isAdjusment, dbTransaction) {
    var expense = await this.getExpense(id);
    const AdjBal = (isAdjusment?amount:0);
    const DebitBal = (isAdjusment?0:amount); 
    await expense.update({
      expenseAdjusments: sequelize.literal('expenseAdjusments+'+AdjBal),
      expenseDebits: sequelize.literal('expenseDebits+'+DebitBal),
      expenseCalculatedBalance: sequelize.literal('expenseCalculatedBalance+'+Number(AdjBal-DebitBal))
    }, {transaction: dbTransaction});
  }

  static async decreaseExpenseBalances(id, amount, isAdjusment, dbTransaction) {
    var expense = await this.getExpense(id);
    const AdjBal = (isAdjusment?amount:0);
    const DebitBal = (isAdjusment?0:amount); 
    await expense.update({
      expenseAdjusments: sequelize.literal('expenseAdjusments-'+AdjBal),
      expenseDebits: sequelize.literal('expenseDebits-'+DebitBal),
      expenseCalculatedBalance: sequelize.literal('expenseCalculatedBalance+'+Number(DebitBal-AdjBal))
    }, {transaction: dbTransaction});
  }

  static async updateExpense(id, {openBalance, allowedDebitTransTypeIds, expenseStatus}){
    var expense = await this.getExpense(id);
    if(!expense) throw new Exception('EXP_HEAD_NOTEXIST');
    await expense.update({
      expenseOpenBalance: openBalance,
      expenseDebitTransTypes: allowedDebitTransTypeIds?allowedDebitTransTypeIds:null,
      expenseCalculatedBalance: sequelize.literal('expenseAdjusments-expenseDebits+'+Number(openBalance)
      +'+expenseTotalAccountDebit'),
      expenseStatus,
      expenseCloseBalance: expenseStatus==='CLOSED'?
        sequelize.literal('expenseCalculatedBalance'):sequelize.literal('expenseCloseBalance')
    })
  }

  static async updateTotalAccountDebit(id, diffAmount, dbTransaction) {
    var expense = await this.getExpense(id);
    if(!expense) throw new Exception('EXP_HEAD_NOTEXIST');
    await expense.update(
      {expenseTotalAccountDebit: sequelize.literal('expenseTotalAccountDebit+'+diffAmount),
      expenseCalculatedBalance: sequelize.literal('expenseCalculatedBalance+'+diffAmount)},
      {transaction: dbTransaction});
  }
}

module.exports = ExpenseRepo;
