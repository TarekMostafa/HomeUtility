const DepositModel = require('./depositModel');
const BankModel = require('../banks/bankModel');
const CurrencyModel = require('../../currencies/CurrencyModel');
const AccountModel = require('../accounts/AccountModel');
const sequelize = require('../../db/dbConnection').getSequelize();

class DepositRepo {
  static async getDeposits(whereQuery) {
    return await DepositModel.findAll({
      include: [
        { model: BankModel, as: 'bank', attributes: ['bankName'] },
        { model: CurrencyModel, as: 'currency', 
          attributes: ['currencyRateAgainstBase', 'currencyDecimalPlace', 'currencyManualRateAgainstBase'] }
      ],
      where: whereQuery
    });
  }

  static async getDeposit(id) {
    return await DepositModel.findByPk(id, {
      include: [
        { model: BankModel, as: 'bank', attributes: ['bankName'] },
        { model: CurrencyModel, as: 'currency', attributes: ['currencyDecimalPlace'] },
        { model: AccountModel, as: 'account', attributes: ['accountNumber'] }
      ]
    });
  }

  static async getDepositsTotalByCurrency() {
    return await DepositModel.findAll({
      attributes: ['currencyCode', 
        [sequelize.fn('sum', sequelize.literal('amount')), 'totalBalance'],
        [sequelize.fn('count', sequelize.literal('amount')), 'totalCount']
      ],
      include: [
        { model: CurrencyModel, as: 'currency', attributes: ['currencyDecimalPlace','currencyRateAgainstBase'] }
      ],
      group: ["currencyCode","currency.currencyDecimalPlace","currency.currencyRateAgainstBase"],
      where: {
        status: "ACTIVE"
      },
      //raw: true
    });
  }

  static async addDeposit(deposit, dbTransaction) {
    return await DepositModel.build(deposit).save({transaction: dbTransaction});
  }
}

module.exports = DepositRepo;
