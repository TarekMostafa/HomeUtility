const Sequelize = require('sequelize');
const ExpenseDetailModel = require('./expenseDetailModel');
const ExpenseTypeModel = require('../expenseType/expenseTypeModel');
const CurrencyModel = require('../../currencies/currencyModel');
const ExpenseModel = require('../expenseHeader/expenseModel');
const Common = require('../../utilities/common');

const Op = Sequelize.Op;

class ExpenseDetailRepo {

  static async getExpensesDetails({description, includeDescription, expDateFrom, expDateTo,
    expIsAdjusment, expTypes, skip, limit}){
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
      let _dateFrom = Common.getDate(expDateFrom, '', false);
      let _dateTo = Common.getDate(expDateTo, '', true);
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

      return await ExpenseDetailModel.findAll({
        offset: skip,
        limit: limit,
        include: [
          { model: ExpenseTypeModel, as: 'expenseType'},
          { model: CurrencyModel, as: 'currency', attributes: ['currencyDecimalPlace'] },
          { model: ExpenseModel, as: 'expense'}
        ],
        where: query,
        order: [ ['expenseDate', 'DESC'] , ['expenseDetailId', 'DESC'] ]
      })
  }

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
      order: [ ['expenseDay', 'DESC'] , ['expenseDetailId', 'DESC'] ]
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
