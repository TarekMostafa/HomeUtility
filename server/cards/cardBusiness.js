const CardRepo = require('./cardRepo');
const Exception = require('../features/exception');
const sequelize = require('../db/dbConnection').getSequelize();

class CardBusiness {
  async getCards({bank, currency, status}) {
    return await CardRepo.getCards({bank, currency, status});
  }

  async getCard(id) {
    return await CardRepo.getCard(id);
  }

  async addCard({cardNumber,cardLimit,cardBank, cardCurrency, cardStartDate, 
    cardExpiryDate}) {
    return await CardRepo.addCard({
        cardNumber: cardNumber,
        cardLimit: cardLimit,
        cardBalance: cardLimit,
        cardStatus: 'ACTIVE',
        cardBank: cardBank,
        cardCurrency: cardCurrency,
        cardStartDate: cardStartDate,
        cardExpiryDate: cardExpiryDate,
        cardLastBalanceUpdate: null
    });
  }

  async updateCard(id, {cardLimit, cardStatus, cardStartDate, cardExpiryDate}) {
    var card = await this.getCard(id);
    if(!card) throw new Exception('CARD_NOT_EXIST');

    let dbTransaction;
    try {
        dbTransaction = await sequelize.transaction();
        const cardOldLimit = card.cardLimit;
        card.cardLimit = cardLimit;
        card.cardStatus = cardStatus;
        card.cardStartDate = cardStartDate;
        card.cardExpiryDate = cardExpiryDate;
        await card.save({transaction: dbTransaction});
        await CardRepo.updateCardBalance(id, (cardLimit-cardOldLimit), dbTransaction);
        await dbTransaction.commit();
    } catch (err) {
        console.log(`error ${err}`);
        await dbTransaction.rollback();
        throw new Exception('CARD_UPDATE_FAIL');
    }
  }

  async deleteCard(id) {
    const card = await this.getCard(id);
    if(!card) throw new Exception('CARD_NOT_EXIST');
    await card.destroy();
  }
}

module.exports = CardBusiness;
