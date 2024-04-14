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
        { model: CardModel, as: 'card', attributes: ['cardNumber'] },
      ]
    });
  }

  static async addCardInstallment(cardInst, dbTransaction) {
    await CardInstallmentModel.build(cardInst).save({transaction: dbTransaction});
  }

  static async updatePostInstallment(id, instAmount, instDate, dbTransaction) {
    var cardInst = await this.getCardInstallment(id);
    if(!cardInst) throw new Exception('CARD_INST_NOT_EXIST');
    await cardInst.update({
      cInstFirstInstDate: (cardInst.cInstFirstInstDate?cardInst.cInstFirstInstDate:Common.getDate(instDate, '')),
      cInstNoOfPostedInst: sequelize.literal('cInstNoOfPostedInst+'+1),
      cInstPosted: sequelize.literal('cInstPosted+'+Number(instAmount)),
      cInstStatus: 'ACTIVE'
    }, {transaction: dbTransaction});
  }

  static async removePostInstallment(id, instAmount, dbTransaction) {
    var cardInst = await this.getCardInstallment(id);
    if(!cardInst) throw new Exception('CARD_INST_NOT_EXIST');
    await cardInst.update({
      cInstNoOfPostedInst: sequelize.literal('cInstNoOfPostedInst-'+1),
      cInstPosted: sequelize.literal('cInstPosted-'+Number(instAmount)),
    }, {transaction: dbTransaction});
  }
}

module.exports = CardInstallmentRepo;
