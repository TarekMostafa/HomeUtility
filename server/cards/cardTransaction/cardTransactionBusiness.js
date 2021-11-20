const CardTransactionRepo = require('./cardTransactionRepo');
const CardRepo = require('../cardRepo');
const CardInstallmentRepo = require('../cardInstallment/cardInstallmentRepo');
const AccountRepo = require('../../wealth/accounts/accountRepo');
const TransactionTypeRepo = require('../../wealth/transactionTypes/transactionTypeRepo');
const Transaction = require('../../wealth/transactions/transaction');
const RelatedTransactionRepo = require('../../wealth/relatedTransactions/relatedTransactionRepo');
const Exception = require('../../features/exception');
const sequelize = require('../../db/dbConnection').getSequelize();
const DateHelper = require('../../helper/DateHelper');
const Common = require('../../utilities/common');

class CardTransactionBusiness {
  async getCardsTransactions({cardId, cardInstId, cardPayment, cardIsPaid, skip, limit}) {
    limit = Common.getNumber(limit, 10);
    skip = Common.getNumber(skip, 0);
    return await CardTransactionRepo.getCardsTransactions({
      cardId, cardInstId, cardPayment, cardIsPaid, skip, limit});
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
        cardTransInstallmentId: null,
        cardTransIsPaid: false
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

    if(cardTrans.cardTransIsInstallment) throw new Exception('CARD_TRANS_INST_FAIL');

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
      if(cardTrans.cardTransIsInstallment) {
        var cardInst = await CardInstallmentRepo.getCardInstallment(cardTrans.cardTransInstallmentId);
        if(!cardInst) throw new Exception('CARD_INST_NOT_EXIST');
        if(cardInst.cInstStatus === 'FINISHED') throw new Exception('CARD_INST_FINISHED');
        CardInstallmentRepo.removePostInstallment(cardTrans.cardTransInstallmentId, 
          cardTrans.cardTransBillAmount, dbTransaction);
      } else {
        await CardRepo.updateCardBalance(cardTrans.cardId, cardTrans.cardTransBillAmount, dbTransaction);
      }
      await cardTrans.destroy({transaction: dbTransaction});
      await dbTransaction.commit();
    } catch (err) {
      console.log(`error ${err}`);
      await dbTransaction.rollback();
      throw new Exception('CARD_TRANS_DELETE_FAIL');
    }
  }

  async PayCardTransactions({cardTransIds, accountId, transactionTypeId, postingDate}) {
    //Simple check
    if(!Array.isArray(cardTransIds)) throw new Exception('CARD_TRANS_INVALID');
    if(!accountId) throw new Exception('ACC_INVALID');
    if(!transactionTypeId) throw new Exception('TRNS_TYP_INVALID');
    //Check account Id
    const account = await AccountRepo.getAccount(accountId);
    if(!account) throw new Exception('ACC_INVALID');
    //Check transactionTypeId
    const transactionType = await TransactionTypeRepo.getTransactionType(transactionTypeId);
    if(!transactionType) throw new Exception('TRNS_TYP_INVALID');
    //Check card transactions Ids 
    let cardTranses = [];
    for(let id of cardTransIds) {
      const cardTrans = await this.getCardTransaction(id);
      if(!cardTrans) throw new Exception('CARD_TRANS_INVALID');
      cardTranses.push(cardTrans);
    }
    //Pay
    let dbTransaction;
    try {
      dbTransaction = await sequelize.transaction();
      const transaction = new Transaction();
      for(let cardTrans of cardTranses) {
        let relId = null;
        //Check Card Installments
        if(cardTrans.cardTransIsInstallment) {
          let cardInst = await CardInstallmentRepo.getCardInstallment(cardTrans.cardTransInstallmentId);
          if(cardInst.cInstRelTransId) relId = cardInst.cInstRelTransId
          else {
            //Create new related transactions
            const relatedTransaction = await RelatedTransactionRepo.
              addRelatedTransaction({
                relatedTransactionType: "CRI",
                relatedTransactionDesc: this.getCardInstallmentRelatedDescription(cardInst)
              }, dbTransaction);
            relId = relatedTransaction.relatedTransactionsId;
            //Save related transaction to card installment
            cardInst.cInstRelTransId = relId;
            await cardInst.save({transaction: dbTransaction});
          }
        }
        //Add Transaction
        const result = await transaction.addTransaction({
          transactionAmount: cardTrans.cardTransBillAmount,
          transactionNarrative: 
          `${cardTrans.cardTransDesc} on ${DateHelper.getFullDateFormat(cardTrans.cardTransDate)}`,
          transactionPostingDate: postingDate,
          transactionCRDR: 'Debit',
          transactionAccount: accountId,
          transactionTypeId: transactionTypeId,
          transactionModule: "CRD",
          transactionRelatedTransactionId: relId,
        }, dbTransaction);
        if(!result.success) {
          await dbTransaction.rollback();
          throw new Exception('CARD_TRANS_PAY_FAIL');
        }
        //Increase Card Balance
        await CardRepo.updateCardBalance(cardTrans.cardId, cardTrans.cardTransBillAmount, dbTransaction);
        //Save Transaction Id in Card Transaction
        cardTrans.cardTransAccountTransId = result.payload.transactionId;
        cardTrans.cardTransIsPaid = true;
        cardTrans.cardTransBillDate = postingDate;
        await cardTrans.save({transaction: dbTransaction});
      }
      await dbTransaction.commit();
    } catch (err) {
      console.log(`error ${err}`);
      await dbTransaction.rollback();
      throw new Exception('CARD_TRANS_PAY_FAIL');
    }
  }

  getCardInstallmentRelatedDescription(cardInst) {
    return `${cardInst.cInstItemDesc} purchased on ${DateHelper.getFullDateFormat(cardInst.cInstPurchaseDate)}`
      + ` from ${cardInst.card.cardNumber} by ${cardInst.cInstPrice} ${cardInst.cInstCurrency}`
  }
}

module.exports = CardTransactionBusiness;
