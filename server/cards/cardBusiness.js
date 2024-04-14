const CardRepo = require('./cardRepo');
const Exception = require('../features/exception');
const sequelize = require('../db/dbConnection').getSequelize();
const CardTransactionRepo = require('./cardTransaction/cardTransactionRepo');
const Common = require('../utilities/common');

const CARD_STATUS = {
  ACTIVE: 'ACTIVE',
  CLOSED: 'CLOSED'
}

class CardBusiness {
  async getCards({bank, currency, status}) {
    let cards = await CardRepo.getCards({bank, currency, status});
    cards = cards.map(card => {
      return  {
        cardId: card.cardId,
        cardNumber: card.cardNumber,
        cardLimit: card.cardLimit,
        cardBalance: card.cardBalance,
        cardStatus: card.cardStatus,
        cardBank: card.cardBank,
        cardCurrency: card.cardCurrency,
        cardStartDate: card.cardStartDate,
        cardExpiryDate: card.cardExpiryDate,
        cardLastBalanceUpdate: card.cardLastBalanceUpdate,
        currencyDecimalPlace: card.currency.currencyDecimalPlace,
        bankName: card.bank.bankName
      }
    });
    return cards;
  }

  async getCard(id) {
    let card = await CardRepo.getCard(id);
    card = {
      cardId: card.cardId,
        cardNumber: card.cardNumber,
        cardLimit: card.cardLimit,
        cardBalance: card.cardBalance,
        cardStatus: card.cardStatus,
        cardBank: card.cardBank,
        cardCurrency: card.cardCurrency,
        cardStartDate: card.cardStartDate,
        cardExpiryDate: card.cardExpiryDate,
        cardLastBalanceUpdate: card.cardLastBalanceUpdate,
        currencyDecimalPlace: card.currency.currencyDecimalPlace,
    }
    return card;
  }

  async addCard({cardNumber,cardLimit,cardBank, cardCurrency, cardStartDate, 
    cardExpiryDate}) {
    await CardRepo.addCard({
        cardNumber: cardNumber,
        cardLimit: cardLimit,
        cardBalance: cardLimit,
        cardStatus: 'ACTIVE',
        cardBank: cardBank,
        cardCurrency: cardCurrency,
        cardStartDate: Common.getDate(cardStartDate, ''),
        cardExpiryDate: Common.getDate(cardExpiryDate, ''),
        cardLastBalanceUpdate: null
    });
  }

  async updateCard(id, {cardLimit, cardStatus, cardStartDate, cardExpiryDate}) {
    //var card = await this.getCard(id);
    let card = await CardRepo.getCard(id);
    if(!card) throw new Exception('CARD_NOT_EXIST');

    if (cardStatus === CARD_STATUS.CLOSED){
      if(cardLimit !== card.cardBalance){
        throw new Exception('CARD_CLOSE_BALANCE');
      }
      cardLimit = 0; 
    } else if(cardStatus === CARD_STATUS.ACTIVE) {
      if(cardLimit === 0) {
        throw new Exception('CARD_ACTIVE_LIMIT');
      }
    }

    let dbTransaction;
    try {
        dbTransaction = await sequelize.transaction();
        const cardOldLimit = card.cardLimit;
        card.cardLimit = cardLimit;
        card.cardStatus = cardStatus;
        card.cardStartDate = Common.getDate(cardStartDate, '');
        card.cardExpiryDate = Common.getDate(cardExpiryDate, '');
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
    //const card = await this.getCard(id);
    const card = await CardRepo.getCard(id);
    if(!card) throw new Exception('CARD_NOT_EXIST');
    const isExist = await CardTransactionRepo.IsCardTransactionExist(id);
    if(isExist) throw new Exception('CARD_TRANS_EXIST');
    await card.destroy();
  }
}

module.exports = CardBusiness;
