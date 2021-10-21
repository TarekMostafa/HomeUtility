const ExpenseDetailModel = require('./expenseDetailModel');
const ExpenseTypeModel = require('../expenseType/expenseTypeModel');
const CurrencyModel = require('../../currencies/currencyModel');
const ExpenseModel = require('../expenseHeader/expenseModel');

class ExpenseDetailRepo {
  static async getExpenseDetails({expenseId}) {
    var query = {};
    if(expenseId) query.expenseId = expenseId;
    return await ExpenseDetailModel.findAll({
      include: [
        { model: ExpenseTypeModel, as: 'expenseType'},
        { model: CurrencyModel, as: 'currency', attributes: ['currencyDecimalPlace'] },
        { model: ExpenseModel, as: 'expense'}
      ],
      where: query,
      order: [ ['expenseDay', 'DESC'] , ['expenseId', 'DESC'] ]
    });
  }

  static async getExpenseDetail(id) {
    return await ExpenseDetailModel.findByPk(id);
  }

  static async addExpenseDetail(expenseDetail, dbTransaction) {
    await ExpenseDetailModel.build(expenseDetail).save({transaction: dbTransaction});
  }
}

module.exports = ExpenseDetailRepo;
