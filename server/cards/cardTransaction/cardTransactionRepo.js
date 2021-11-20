const CardTransactionModel = require('./cardTransactionModel');
const sequelize = require('../../db/dbConnection').getSequelize();
const CurrencyModel = require('../../currencies/currencyModel');
const CardModel = require('../cardModel');
const BankModel = require('../../wealth/banks/bankModel');
const Exception = require('../../features/exception');

class CardTransactionRepo {
  static async getCardsTransactions({cardId, cardInstId, cardPayment, cardIsPaid, skip, limit}) {
    var query = {};
    if(cardId) query.cardId = cardId;
    if(cardInstId) query.cardTransInstallmentId = cardInstId;
    if(cardPayment) query.cardTransIsPaid = cardIsPaid;
    return await CardTransactionModel.findAll({
      offset: skip,
      limit: limit,
      include: [
        { model: CurrencyModel, as: 'currency', attributes: ['currencyDecimalPlace']},
        { model: CardModel, as: 'card', attributes: ['cardNumber', 'cardBank', 'cardCurrency'], 
          include: [
            { model: BankModel, as: 'bank', attributes: ['bankName'] },
            { model: CurrencyModel, as: 'currency', attributes: ['currencyDecimalPlace']}
           ]
        },
      ],
      where: query,
      order: [ ['cardTransDate', 'DESC'] ]
    });
  }

  static async getCardTransaction(id) {
    return await CardTransactionModel.findByPk(id, {
      include: [
        { model: CurrencyModel, as: 'currency', attributes: ['currencyDecimalPlace']},
        { model: CardModel, as: 'card', attributes: ['cardNumber', 'cardBank', 'cardCurrency'], 
          include: [
            { model: BankModel, as: 'bank', attributes: ['bankName'] },
            { model: CurrencyModel, as: 'currency', attributes: ['currencyDecimalPlace']}
           ]
        },
      ]
    });
  }

  static async addCardTransaction(cardTrans, dbTransaction) {
    await CardTransactionModel.build(cardTrans).save({transaction: dbTransaction});
  }
}

module.exports = CardTransactionRepo;
