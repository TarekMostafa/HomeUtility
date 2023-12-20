const CardInstallmentRepo = require('./cardInstallmentRepo');
const CardRepo = require('../cardRepo');
const Exception = require('../../features/exception');
const sequelize = require('../../db/dbConnection').getSequelize();
const CardTransactionRepo = require('../cardTransaction/cardTransactionRepo');

class CardInstallmentBusiness {
  async getCardsInstallments({cardId}) {
    let cardInstallments = await CardInstallmentRepo.getCardsInstallments({cardId});
    cardInstallments = cardInstallments.map(inst => {
      return { 
        cInstId: inst.cInstId,
        cardId: inst.cardId,
        cInstCurrency: inst.cInstCurrency,
        cInstItemDesc: inst.cInstItemDesc,
        cInstPurchaseDate: inst.cInstPurchaseDate,
        cInstFirstInstDate: inst.cInstFirstInstDate,
        cInstNoOfInst: inst.cInstNoOfInst,
        cInstPrice: inst.cInstPrice,
        cInstNoOfPostedInst: inst.cInstNoOfPostedInst,
        cInstPosted: inst.cInstPosted,
        cInstRelTransId: inst.cInstRelTransId,
        cInstStatus: inst.cInstStatus,
        currencyDecimalPlace: inst.currency.currencyDecimalPlace,
        cardNumber: inst.card.cardNumber,
      }
    });
    return cardInstallments;
  }

  async getCardInstallment(id) {
    let cardInstallment = await CardInstallmentRepo.getCardInstallment(id);
    cardInstallment = {
      cInstId: cardInstallment.cInstId,
      cardId: cardInstallment.cardId,
      cInstCurrency: cardInstallment.cInstCurrency,
      cInstItemDesc: cardInstallment.cInstItemDesc,
      cInstPurchaseDate: cardInstallment.cInstPurchaseDate,
      cInstFirstInstDate: cardInstallment.cInstFirstInstDate,
      cInstNoOfInst: cardInstallment.cInstNoOfInst,
      cInstPrice: cardInstallment.cInstPrice,
      cInstNoOfPostedInst: cardInstallment.cInstNoOfPostedInst,
      cInstPosted: cardInstallment.cInstPosted,
      cInstRelTransId: cardInstallment.cInstRelTransId,
      cInstStatus: cardInstallment.cInstStatus,
      currencyDecimalPlace: cardInstallment.currency.currencyDecimalPlace,
      cardNumber: cardInstallment.card.cardNumber,
    };
    return cardInstallment;
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
        cInstNoOfPostedInst: 0,
        cInstPosted: 0,
        cInstRelTransId: null,
        cInstStatus: 'NEW'
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
    //var cardInst = await this.getCardInstallment(cardInstId);
    let cardInst = await CardInstallmentRepo.getCardInstallment(cardInstId);
    if(!cardInst) throw new Exception('CARD_INST_NOT_EXIST');

    if(cardInst.cInstStatus === 'FINISHED') throw new Exception('CARD_INST_FINISHED');

    cardInst.cInstItemDesc = itemDesc;
    cardInst.cInstPurchaseDate = purchaseDate;
    cardInst.cInstNoOfInst = noOfInst;
    await cardInst.save();
  }

  async deleteCardInstallment(cardInstId) {
    //var cardInst = await this.getCardInstallment(cardInstId);
    let cardInst = await CardInstallmentRepo.getCardInstallment(cardInstId);
    if(!cardInst) throw new Exception('CARD_INST_NOT_EXIST');

    if(cardInst.cInstStatus === 'FINISHED') throw new Exception('CARD_INST_FINISHED');

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

  async postInstallment(cardInstId, {transAmt, transDate, transDesc}){
    //var cardInst = await this.getCardInstallment(cardInstId);
    let cardInst = await CardInstallmentRepo.getCardInstallment(cardInstId);
    if(!cardInst) throw new Exception('CARD_INST_NOT_EXIST');

    if(cardInst.cInstStatus === 'FINISHED') throw new Exception('CARD_INST_FINISHED');

    let dbTransaction;
    try {
      dbTransaction = await sequelize.transaction();
      await CardTransactionRepo.addCardTransaction({
        cardId: cardInst.cardId,
        cardTransAmount: transAmt,
        cardTransCurrency: cardInst.cInstCurrency,
        cardTransDate: transDate,
        cardTransDesc: transDesc,
        cardTransBillAmount: transAmt,
        cardTransBillDate: null,
        cardTransIsInstallment: true,
        cardTransAccountTransId: null,
        cardTransInstallmentId: cardInst.cInstId
      }, dbTransaction)
      await CardInstallmentRepo.updatePostInstallment(cardInstId, transAmt, transDate, dbTransaction);
      await dbTransaction.commit();
    } catch (err) {
      console.log(`error ${err}`);
      await dbTransaction.rollback();
      throw new Exception('CARD_INST_POST_FAIL');
    }
  }

  async terminateInstallment(cardInstId) {
    //var cardInst = await this.getCardInstallment(cardInstId);
    let cardInst = await CardInstallmentRepo.getCardInstallment(cardInstId);
    if(!cardInst) throw new Exception('CARD_INST_NOT_EXIST');

    if(cardInst.cInstStatus === 'FINISHED') throw new Exception('CARD_INST_FINISHED');
    if(Number(cardInst.cInstPrice) > Number(cardInst.cInstPosted)) 
      throw new Exception('CARD_INST_PRICE_NOT_POSTED');
    
    cardInst.cInstStatus = 'FINISHED';
    return await cardInst.save();
  }
}

module.exports = CardInstallmentBusiness;
