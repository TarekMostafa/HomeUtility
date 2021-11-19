const CardTransactionRepo = require('./cardTransactionRepo');
const CardRepo = require('../cardRepo');
const Exception = require('../../features/exception');
const sequelize = require('../../db/dbConnection').getSequelize();

class CardTransactionBusiness {
  async getCardsTransactions({cardId, cardInstId}) {
    return await CardTransactionRepo.getCardsTransactions({cardId, cardInstId});
  }

  async getCardTransaction(id) {
    return await CardTransactionRepo.getCardTransaction(id);
  }

  async addCardTransaction({cardId, transCurrency, transAmount, transDate, transDesc, billAmount}) {
    var card = await CardRepo.getCard(cardId);
    if(!card) throw new Exception('CARD_NOT_EXIST');
    
    let dbTransaction;
    try {
      dbTransaction = await sequelize.transaction();
      await CardTransactionRepo.addCardTransaction({
        cardId,
        cardTransAmount: transAmount,
        cardTransCurrency: transCurrency,
        cardTransDate: transDate,
        cardTransDesc: transDesc,
        cardTransBillAmount: billAmount,
        cardTransBillDate: null,
        cardTransIsInstallment: false,
        cardTransAccountTransId: null,
        cardTransInstallmentId: null
      }, dbTransaction);
      await CardRepo.updateCardBalance(cardId, billAmount * -1, dbTransaction);
      await dbTransaction.commit();
    } catch (err) {
        console.log(`error ${err}`);
        await dbTransaction.rollback();
        throw new Exception('CARD_TRANS_ADD_FAIL');
    }
  }

  async updateCardTransaction(cardTransId, {transCurrency, transAmount, transDate, transDesc, billAmount}) {
    var cardTrans = await this.getCardTransaction(cardTransId);
    if(!cardTrans) throw new Exception('CARD_TRANS_NOT_EXIST');

    let dbTransaction;
    try {
      dbTransaction = await sequelize.transaction();
      await CardRepo.updateCardBalance(cardTrans.cardId, 
        cardTrans.cardTransBillAmount - billAmount, dbTransaction);
      cardTrans.cardTransCurrency = transCurrency;
      cardTrans.cardTransAmount = transAmount;
      cardTrans.cardTransDate = transDate;
      cardTrans.cardTransDesc = transDesc;
      cardTrans.cardTransBillAmount = billAmount;
      await cardTrans.save({transaction: dbTransaction});
      await dbTransaction.commit();
    } catch (err) {
      console.log(`error ${err}`);
      await dbTransaction.rollback();
      throw new Exception('CARD_TRANS_UPDATE_FAIL');
    }
  }

  async deleteCardTransaction(cardTransId) {
    var cardTrans = await this.getCardTransaction(cardTransId);
    if(!cardTrans) throw new Exception('CARD_TRANS_NOT_EXIST');

    let dbTransaction;
    try {
      dbTransaction = await sequelize.transaction();
      await CardRepo.updateCardBalance(cardTrans.cardId, cardTrans.cardTransBillAmount, dbTransaction);
      await cardTrans.destroy({transaction: dbTransaction});
      await dbTransaction.commit();
    } catch (err) {
      console.log(`error ${err}`);
      await dbTransaction.rollback();
      throw new Exception('CARD_TRANS_DELETE_FAIL');
    }
  }
}

module.exports = CardTransactionBusiness;
