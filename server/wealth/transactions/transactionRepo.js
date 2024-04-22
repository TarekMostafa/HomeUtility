const Sequelize = require('sequelize');
const sequelize = require('../../db/dbConnection').getSequelize();
const TransactionModel = require('./transactionModel');
const AccountModel = require('../accounts/accountModel');
const CurrencyModel = require('../../currencies/currencyModel');
const TransactionTypeModel = require('../transactionTypes/transactionTypeModel');
const RelatedTransactionModel = require('../relatedTransactions/relatedTransactionModel');

const Op = Sequelize.Op;

class TransactionRepo {
  static async getTransactions(skip, limit, whereQuery) {
    return await TransactionModel.findAll({
      offset: skip,
      limit: limit,
      attributes: ['transactionId', 'transactionPostingDate', 'transactionAmount',
        'transactionCRDR', 'transactionNarrative', 'transactionRelatedTransactionId',
        'transactionModule', 'transactionTypeId'],
      include: [
        { model: AccountModel, as: 'account', attributes: ['accountNumber','accountCurrency'],
          include: [
            { model: CurrencyModel, as: 'currency', attributes: ['currencyRateAgainstBase', 
              'currencyDecimalPlace'] }
          ]
        },
        { model: TransactionTypeModel, as: 'transactionType', attributes: ['typeName'] },
        { model: RelatedTransactionModel, as: 'relatedtransaction', 
          attributes: ['relatedTransactionType']
        }
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

  static async getTotalTransactionsGroupByType(whereQuery, currency) {
    return await TransactionModel.findAll({
      attributes: [
        [sequelize.fn('sum', sequelize.literal(
          'Round(transactionAmount*(case when transactionCRDR = \'Credit\' then 1 else -1 end),3)')), "total"]
        ,'transactionType.typeName'],
      include: [
        { model: AccountModel, as: 'account', attributes: [],
          include: [
            { model: CurrencyModel, as: 'currency', attributes: [] }
          ], 
          where: {
            accountCurrency: currency
          }
        },
        { model: TransactionTypeModel, as: 'transactionType', attributes: [] }
      ],
      //group: [sequelize.literal('case when transactionTypeId is not null then transactionType.typeName else \'\' end')],
      group: [sequelize.literal('typeName')],
      where: whereQuery,
      raw: true
    });
  }

  static async getSumTransactions(types, currency, dateFrom, dateTo){
    let whereQuery = {};
    let accountWhereQuery = {};
    // Transaction Type Id
    if(types) {
      //whereQuery.transactionTypeId = typeId;
      whereQuery.transactionTypeId = {
        [Op.in]: types
      }
    }
    //Currency
    if(currency)
      accountWhereQuery.accountCurrency = currency
    //Date Range
    if(dateFrom && dateTo)
      whereQuery.transactionPostingDate = { [Op.between] : [dateFrom, dateTo] };
    //whereQuery.
    let sum = await TransactionModel.findAll({
      attributes: [
        [sequelize.fn('sum', 
        sequelize.literal('transactionAmount*(case when transactionCRDR = \'Credit\' then 1 else -1 end)')),
         "total"]],
      include: [
        { model: AccountModel, as: 'account', attributes: [], where:accountWhereQuery},
      ],
      //group: [sequelize.literal('transactionAmount*(case when transactionCRDR = \'Credit\' then 1 else -1 end)')],
      where: whereQuery,
      raw: true
    });

    if(sum && Array.isArray(sum) && sum.length > 0) return sum[0].total;
    else return 0;
  }

  static async IsDepositTransactionExist(relatedId, originalTransId) {
    let transaction = await TransactionModel.findOne({
      where: {
        transactionId: {
          [Op.ne]: originalTransId
        },
        transactionRelatedTransactionId: relatedId
      }
    });
    return transaction?true:false;
  }
}

module.exports = TransactionRepo;
