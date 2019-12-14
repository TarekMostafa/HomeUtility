const { BillModel, BillItemModel } = require('./billModel');
const CurrencyModel = require('../currencies/CurrencyModel');

class BillRepo {
  static async getSimpleBills() {
    return await BillModel.findAll({
      attributes: ['billId', 'billName', 'billStatus', 'billCurrency', 'billFrequency', 'billDefaultAmount'],
      include: [
        { model: CurrencyModel, as: 'currency', attributes: ['currencyDecimalPlace'] }
      ]
    });
  }

  static async getBills(whereQuery) {
    return await BillModel.findAll({ 
      where : whereQuery,
      include: [
        { model: CurrencyModel, as: 'currency', attributes: ['currencyDecimalPlace'] }
      ]
    });
  }

  static async getBill(id) {
    return await BillModel.findByPk(id, {
      include: [
        { model: CurrencyModel, as: 'currency', attributes: ['currencyDecimalPlace'] },
        { model: BillItemModel, as: 'billItems'}
      ]
    });
  }

  static async addBill(bill, dbTransaction) {
    await BillModel.build(bill, {
      include: [{model: BillItemModel, as: 'billItems'}]
    }).save({transaction: dbTransaction});
  }

  static async addBillItem(billItem, dbTransaction) {
    await BillItemModel.build(billItem).save({transaction: dbTransaction});
  }
}

module.exports = BillRepo;
