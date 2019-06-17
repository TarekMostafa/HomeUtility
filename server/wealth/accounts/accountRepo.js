const AccountModel = require('./accountModel');
const BankModel = require('../banks/bankModel');
const CurrencyModel = require('../../currencies/CurrencyModel');

class AccountRepo {
  static async getSimpleAccounts() {
    return await AccountModel.findAll({
      attributes: ['accountId', 'accountNumber', 'accountStatus'],
      include: [
        { model: CurrencyModel, as: 'currency', attributes: ['currencyDecimalPlace'] }
      ]
    });
  }

  static async getAccounts(whereQuery) {
    return await AccountModel.findAll({
      include: [
        { model: BankModel, as: 'bank', attributes: ['bankName'] },
        { model: CurrencyModel, as: 'currency', attributes: ['currencyRateAgainstBase', 'currencyDecimalPlace'] }
      ],
      where: whereQuery
    });
  }

  static async getAccount(id) {
    return await AccountModel.findByPk(id, {
      include: [
        { model: BankModel, as: 'bank', attributes: ['bankName'] },
        { model: CurrencyModel, as: 'currency', attributes: ['currencyDecimalPlace'] }
      ]
    });
  }

  static async addAccount(account) {
    await AccountModel.build(account).save();
  }
}

module.exports = AccountRepo;
