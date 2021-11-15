const CardModel = require('./cardModel');
const sequelize = require('../db/dbConnection').getSequelize();
const CurrencyModel = require('../currencies/currencyModel');
const BankModel = require('../wealth/banks/bankModel');
const Exception = require('../features/exception');

class CardRepo {
  static async getCards({bank, currency, status}) {
    var query = {};
    if(bank) query.cardBank = bank;
    if(currency) query.cardCurrency = currency;
    if(status) query.cardStatus = status;
    return await CardModel.findAll({
      include: [
        { model: CurrencyModel, as: 'currency', attributes: ['currencyDecimalPlace'] },
        { model: BankModel, as: 'bank', attributes: ['bankName'] },
      ],
      where: query,
      order: [ ['cardStartDate', 'DESC'] ]
    });
  }

  static async getCard(id) {
    return await CardModel.findByPk(id, {
      include: [
        { model: CurrencyModel, as: 'currency', attributes: ['currencyDecimalPlace'] },
      ]
    });
  }

  static async addCard(card) {
    await CardModel.build(card).save();
  }

  static async updateCardBalance(id, amount, dbTransaction) {
    var card = await this.getCard(id);
    if(!card) throw new Exception('CARD_NOT_EXIST');
    await card.update({
      cardBalance: sequelize.literal('cardBalance+'+Number(amount)),
      cardLastBalanceUpdate: sequelize.fn('NOW')
    }, {transaction: dbTransaction});
  }
}

module.exports = CardRepo;
