const AccountModel = require('./accountModel');
const BankModel = require('../banks/bankModel');
const CurrencyModel = require('../../currencies/CurrencyModel');
const sequelize = require('../../db/dbConnection').getSequelize();

class AccountRepo {
  static async getSimpleAccounts() {
    return await AccountModel.findAll({
      attributes: ['accountId', 'accountNumber', 'accountStatus', 'accountCurrency', 'accountBankCode'],
      include: [
        { model: BankModel, as: 'bank', attributes: ['bankName'] },
        { model: CurrencyModel, as: 'currency', attributes: ['currencyDecimalPlace'] }
      ]
    });
  }

  static async getAccounts(whereQuery) {
    return await AccountModel.findAll({
      include: [
        { model: BankModel, as: 'bank', attributes: ['bankName'] },
        { model: CurrencyModel, as: 'currency', attributes: ['currencyRateAgainstBase', 
          'currencyDecimalPlace', 'currencyManualRateAgainstBase'] }
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

  static async getAccountsTotalByCurrency() {
    return await AccountModel.findAll({
      attributes: ['accountCurrency', 
        [sequelize.fn('sum', sequelize.literal('accountCurrentBalance')), 'totalBalance'],
        [sequelize.fn('count', sequelize.literal('accountCurrentBalance')), 'totalCount']
      ],
      include: [
        { model: CurrencyModel, as: 'currency', attributes: ['currencyDecimalPlace','currencyRateAgainstBase'] }
      ],
      group: ["accountCurrency","currency.currencyDecimalPlace","currency.currencyRateAgainstBase"],
      where: {
        accountStatus: "ACTIVE"
      },
      //raw: true
    });
  }

  static async addAccount(account) {
    await AccountModel.build(account).save();
  }

  static async updateAccountCurrentBalance(account, amount, dbTransaction) {
    await account.update(
      {accountCurrentBalance: sequelize.literal('accountCurrentBalance+'+amount),
      accountLastBalanceUpdate: sequelize.fn('NOW')},
      {transaction: dbTransaction});
  }
}

module.exports = AccountRepo;
