const CardInstallmentModel = require('./cardInstallmentModel');
const sequelize = require('../../db/dbConnection').getSequelize();
const CurrencyModel = require('../../currencies/currencyModel');
const CardModel = require('../cardModel');
const Exception = require('../../features/exception');

class CardInstallmentRepo {
  static async getCardsInstallments({cardId}) {
    var query = {};
    if(cardId) query.cardId = cardId;
    return await CardInstallmentModel.findAll({
      include: [
        { model: CurrencyModel, as: 'currency', attributes: ['currencyDecimalPlace'] },
        { model: CardModel, as: 'card', attributes: ['cardNumber'] },
      ],
      where: query,
      order: [ ['cInstPurchaseDate', 'DESC'] ]
    });
  }

  static async getCardInstallment(id) {
    return await CardInstallmentModel.findByPk(id, {
      include: [
        { model: CurrencyModel, as: 'currency', attributes: ['currencyDecimalPlace'] },
      ]
    });
  }

  static async addCardInstallment(cardInst, dbTransaction) {
    await CardInstallmentModel.build(cardInst).save({transaction: dbTransaction});
  }
}

module.exports = CardInstallmentRepo;
