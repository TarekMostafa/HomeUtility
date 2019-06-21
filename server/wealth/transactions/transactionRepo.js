const sequelize = require('../../db/dbConnection').getSequelize();
const TransactionModel = require('./transactionModel');
const AccountModel = require('../accounts/accountModel');
const CurrencyModel = require('../../currencies/currencyModel');
const TransactionTypeModel = require('../transactionTypes/transactionTypeModel');

class TransactionRepo {
  static async getTransactions(skip, limit, whereQuery) {
    return await TransactionModel.findAll({
      offset: skip,
      limit: limit,
      attributes: ['transactionId', 'transactionPostingDate', 'transactionAmount',
        'transactionCRDR', 'transactionNarrative', 'transactionRelatedTransactionId'],
      include: [
        { model: AccountModel, as: 'account', attributes: ['accountNumber','accountCurrency'],
          include: [
            { model: CurrencyModel, as: 'currency', attributes: ['currencyRateAgainstBase', 'currencyDecimalPlace'] }
          ]
        },
        { model: TransactionTypeModel, as: 'transactionType', attributes: ['typeName'] }
      ],
      where: whereQuery,
      order: [ ['transactionPostingDate', 'DESC'] , ['transactionId', 'DESC'] ]
    });
  }

  static async getTransaction(id) {
    return await TransactionModel.findByPk(id, {
      include: [
        { model: AccountModel, as: 'account', attributes: ['accountCurrency'],
          include: [
            { model: CurrencyModel, as: 'currency', attributes: ['currencyDecimalPlace'] }
          ]
        }
      ]
    });
  }

  static async addTransaction(transaction, dbTransaction) {
    return await TransactionModel.build(transaction).save({transaction: dbTransaction});
  }

  static async getTransactionsCountByTransactionType(typeId) {
    return await TransactionModel.count({
      where: {transactionTypeId: typeId}
    });
  }

  static async getTotalTransactionsGroupByType(whereQuery) {
    return await TransactionModel.findAll({
      attributes: [
        [sequelize.fn('sum', sequelize.literal(
          'Round(transactionAmount*currencyRateAgainstBase*(case when transactionCRDR = \'Credit\' then 1 else -1 end),3)')), "total"]],
      include: [
        { model: AccountModel, as: 'account', attributes: [],
          include: [
            { model: CurrencyModel, as: 'currency', attributes: [] }
          ]
        },
        { model: TransactionTypeModel, as: 'transactionType', attributes: ['typeName'] }
      ],
      group: [sequelize.literal('case when transactionTypeId is not null then transactionType.typeName else \'\' end')],
      where: whereQuery,
    });
  }
}

module.exports = TransactionRepo;
