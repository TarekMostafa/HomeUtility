const DepositModel = require('./depositModel');
const BankModel = require('../banks/bankModel');
const CurrencyModel = require('../../currencies/CurrencyModel');

class DepositRepo {
  static async getDeposits(whereQuery) {
    return await DepositModel.findAll({
      include: [
        { model: BankModel, as: 'bank', attributes: ['bankName'] },
        { model: CurrencyModel, as: 'currency', attributes: ['currencyRateAgainstBase', 'currencyDecimalPlace'] }
      ],
      where: whereQuery
    });
  }

  static async getDeposit(id) {
    return await DepositModel.findByPk(id, {
      include: [
        { model: BankModel, as: 'bank', attributes: ['bankName'] },
        { model: CurrencyModel, as: 'currency', attributes: ['currencyDecimalPlace'] }
      ]
    });
  }

  static async addDeposit(deposit, dbTransaction) {
    return await DepositModel.build(deposit).save({transaction: dbTransaction});
  }
}

module.exports = DepositRepo;
