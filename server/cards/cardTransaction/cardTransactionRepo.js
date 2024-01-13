const CardTransactionModel = require('./cardTransactionModel');
const sequelize = require('../../db/dbConnection').getSequelize();
const CurrencyModel = require('../../currencies/currencyModel');
const CardModel = require('../cardModel');
const BankModel = require('../../wealth/banks/bankModel');
const Exception = require('../../features/exception');
const Sequelize = require('sequelize');
const Common = require('../../utilities/common');

const Op = Sequelize.Op;

class CardTransactionRepo {
  static async getCardsTransactions({cardId, cardInstId, cardPayment, cardIsPaid, skip, limit,
    description, includeDescription, transDateFrom, transDateTo}) {
    var query = {};
    if(cardId) query.cardId = cardId;
    if(cardInstId) query.cardTransInstallmentId = cardInstId;
    if(cardPayment) query.cardTransIsPaid = cardIsPaid;
    // Description
    if(description) {
      if(includeDescription==='true') {
        query.cardTransDesc = {
          [Op.substring] : description
        }
      } else {
        query.cardTransDesc = {
          [Op.notLike] : '%'+description.trim()+'%'
        }
      }
    }
    // Check Transaction Date from and Transaction Date To
    let _dateFrom = Common.getDate(transDateFrom, '', false);
    let _dateTo = Common.getDate(transDateTo, '', true);
    if( _dateFrom !== '' && _dateTo !== '') {
      query.cardTransDate = { [Op.between] : [_dateFrom, _dateTo] };
    } else {
      if(_dateFrom !== '') {
        query.cardTransDate = { [Op.gte] : _dateFrom };
      } else if(_dateTo !== '') {
        query.cardTransDate = { [Op.lte] : _dateTo };
      }
    }
    
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

  static async IsCardTransactionExist(cardId) {
    let cardTransaction = await CardTransactionModel.findOne({
      where: {
        cardId
      }
    });
    return cardTransaction?true:false;
  }
}

module.exports = CardTransactionRepo;
