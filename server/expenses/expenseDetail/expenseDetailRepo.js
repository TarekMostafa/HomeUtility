const Sequelize = require('sequelize');
const sequelize = require('../../db/dbConnection').getSequelize();
const ExpenseDetailModel = require('./expenseDetailModel');
const ExpenseTypeModel = require('../expenseType/expenseTypeModel');
const CurrencyModel = require('../../currencies/currencyModel');
const ExpenseModel = require('../expenseHeader/expenseModel');

const Op = Sequelize.Op;

class ExpenseDetailRepo {

  static async getExpensesDetails({skip, limit, query}){
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

  static async getExpensesDetailsCount(query){
    return await ExpenseDetailModel.count({
      where: query,
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
    return await ExpenseDetailModel.findByPk(id, {
      include: [
        { model: CurrencyModel, as: 'currency', attributes: ['currencyDecimalPlace'] },
      ]
    });
  }

  static async addExpenseDetail(expenseDetail, dbTransaction) {
    await ExpenseDetailModel.build(expenseDetail).save({transaction: dbTransaction});
  }

  static async updateBillTransactionId(expenseDetailId, billTransId, dbTransaction) {
    let expenseDetail = await this.getExpenseDetail(expenseDetailId);
    if(!expenseDetail) throw new Exception('EXP_DET_NOTEXIST');

    expenseDetail.expenseBillTransId = billTransId;
    expenseDetail.save({transaction: dbTransaction});
  }

  //Same as getTotalTransactionsGroupByLabel in transactionRepo
  static async getTotalExpensesGroupByLabel(label, currency, whereQuery) {
    let labelField = `expenseLabel${label}`;

    return await ExpenseDetailModel.findAll({
      attributes: [
        [sequelize.fn('sum', sequelize.literal(
          'Round(expenseAmount*(case when (expenseAmount < 0 and expenseAdjusment = 0) or (expenseAmount > 0 and expenseAdjusment = 1) then 1 else -1 end),3)')), "total"]
        ,[labelField, "label"]],
      include: [
            { model: CurrencyModel, as: 'currency', attributes: [] }
      ], 
      group: [labelField],
      where: {
        ...whereQuery,
        expenseCurrency: currency
      },
      raw: true
    });
  }

  static async updateBulkExpenseDetailLabel(expenseDetailIds, label, labelValue, forceUpdate) {
    let labelField = `expenseLabel${label}`;

    let whereQuery = {};
    whereQuery.expenseDetailId = {
      [Op.in]: expenseDetailIds
    };

    if(!forceUpdate) whereQuery[labelField] = {
      [Op.or] : [
        {[Op.eq]: null},
        {[Op.eq]: ''}
      ]
    }

    return await ExpenseDetailModel.update({
      [labelField]: labelValue
    },{
      where: whereQuery  
    })
  }
}

module.exports = ExpenseDetailRepo;
