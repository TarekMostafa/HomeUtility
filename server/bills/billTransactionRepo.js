const { BillTransactionModel, BillTransactionDetailModel } = require('./billTransactionModel');
const { BillModel, BillItemModel } = require('./billModel');
const CurrencyModel = require('../currencies/CurrencyModel');

class BillTransactionRepo {
  static async getBillTransactions(skip, limit, whereQuery) {
    return await BillTransactionModel.findAll({ 
      offset: skip,
      limit: limit,
      where : whereQuery,
      include: [
        { model: CurrencyModel, as: 'currency', attributes: ['currencyDecimalPlace'] },
        { model: BillModel, as: 'bill', attributes: ['billName']}
      ],
      order: [['transBillDate', 'DESC'], ['transId', 'DESC']]
    });
  }

  static async getBillTransaction(id) {
    return await BillTransactionModel.findByPk(id, {
      include: [
        { model: CurrencyModel, as: 'currency', attributes: ['currencyDecimalPlace'] },
        { model: BillModel, as: 'bill', attributes: ['billName']},
        { model: BillTransactionDetailModel, as: 'billTransactionDetails', 
          include: { model: BillItemModel, as: 'billItem'},
        },
      ]
    });
  }

  static async getBillTransactionDetails(whereQuery) {
    return await BillTransactionDetailModel.findAll({
      where : whereQuery,
    })
  }

  static async addBillTransaction(billTransaction, dbTransaction) {
    await BillTransactionModel.build(billTransaction, {
      include: [{model: BillTransactionDetailModel, as: 'billTransactionDetails'}]
    }).save({transaction: dbTransaction});
  }

  static async addBillTransactionDetail(billTransactionDetail, dbTransaction) {
    await BillTransactionDetailModel.build(billTransactionDetail).save({transaction: dbTransaction});
  }
}

module.exports = BillTransactionRepo;
