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
      expenseCloseBalance: sequelize.literal('expenseCloseBalance+'+Number(AdjBal-DebitBal))
    }, {transaction: dbTransaction});
  }

  static async decreaseExpenseBalances(id, amount, isAdjusment, dbTransaction) {
    var expense = await this.getExpense(id);
    const AdjBal = (isAdjusment?amount:0);
    const DebitBal = (isAdjusment?0:amount); 
    await expense.update({
      expenseAdjusments: sequelize.literal('expenseAdjusments-'+AdjBal),
      expenseDebits: sequelize.literal('expenseDebits-'+DebitBal),
      expenseCloseBalance: sequelize.literal('expenseCloseBalance+'+Number(DebitBal-AdjBal))
    }, {transaction: dbTransaction});
  }

  static async updateExpense(id, {openBalance}){
    var expense = await this.getExpense(id);
    if(!expense) throw new Exception('EXP_HEAD_NOTEXIST');
    await expense.update({
      expenseOpenBalance: openBalance,
      expenseCloseBalance: sequelize.literal('expenseAdjusments-expenseDebits+'+Number(openBalance))
    })
  }
}

module.exports = ExpenseRepo;
