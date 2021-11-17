const CardInstallmentRepo = require('./cardInstallmentRepo');
const CardRepo = require('../cardRepo');
const Exception = require('../../features/exception');
const sequelize = require('../../db/dbConnection').getSequelize();

class CardInstallmentBusiness {
  async getCardsInstallments({cardId}) {
    return await CardInstallmentRepo.getCardsInstallments({cardId});
  }

  async getCardInstallment(id) {
    return await CardInstallmentRepo.getCardInstallment(id);
  }

  async addCardInstallment({cardId, itemDesc, purchaseDate, noOfInst, price}) {
    var card = await CardRepo.getCard(cardId);
    if(!card) throw new Exception('CARD_NOT_EXIST');
    
    let dbTransaction;
    try {
      dbTransaction = await sequelize.transaction();
      await CardInstallmentRepo.addCardInstallment({
        cardId,
        cInstCurrency: card.cardCurrency,
        cInstItemDesc: itemDesc,
        cInstPurchaseDate: purchaseDate,
        cInstFirstInstDate: null,
        cInstNoOfInst: noOfInst,
        cInstPrice: price,
        cInstPaid: 0,
        cInstRelTransId: null
      }, dbTransaction);
      await CardRepo.updateCardBalance(cardId, price * -1, dbTransaction);
      await dbTransaction.commit();
    } catch (err) {
        console.log(`error ${err}`);
        await dbTransaction.rollback();
        throw new Exception('CARD_INST_ADD_FAIL');
    }
  }

  async updateCardInstallment(cardInstId, {itemDesc, purchaseDate, noOfInst}) {
    var cardInst = await this.getCardInstallment(cardInstId);
    if(!cardInst) throw new Exception('CARD_INST_NOT_EXIST');

    cardInst.cInstItemDesc = itemDesc;
    cardInst.cInstPurchaseDate = purchaseDate;
    cardInst.cInstNoOfInst = noOfInst;
    return await cardInst.save();
  }

  async deleteCardInstallment(cardInstId) {
    var cardInst = await this.getCardInstallment(cardInstId);
    if(!cardInst) throw new Exception('CARD_INST_NOT_EXIST');

    let dbTransaction;
    try {
      dbTransaction = await sequelize.transaction();
      await CardRepo.updateCardBalance(cardInst.cardId, cardInst.cInstPrice, dbTransaction);
      await cardInst.destroy({transaction: dbTransaction});
      await dbTransaction.commit();
    } catch (err) {
      console.log(`error ${err}`);
      await dbTransaction.rollback();
      throw new Exception('CARD_INST_DELETE_FAIL');
    }
  }
}

module.exports = CardInstallmentBusiness;
