const ExpenseModel = require('./expenseModel');

class ExpenseRepo {
  static async getExpenses({year, month, currency}) {
    var query = {};
    if(year) query.expenseYear = year;
    if(month) query.expenseMonth = month;
    if(currency) query.expenseCurrency = currency;
    return await ExpenseModel.findAll({
      where: query,
      order: [ ['expenseYear', 'DESC'] , ['expenseMonth', 'DESC'] ]
    });
  }

  static async getExpense(id) {
    return await ExpenseModel.findByPk(id);
  }

  static async addExpense(expense) {
    await ExpenseModel.build(expense).save();
  }
}

module.exports = ExpenseRepo;
