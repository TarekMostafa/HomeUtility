const CardTransactionRepo = require('./cardTransactionRepo');
const CardRepo = require('../cardRepo');
const CardInstallmentRepo = require('../cardInstallment/cardInstallmentRepo');
const AccountRepo = require('../../wealth/accounts/accountRepo');
const TransactionTypeRepo = require('../../wealth/transactionTypes/transactionTypeRepo');
const TransactionBusiness = require('../../wealth/transactions/transactionBusiness');
const RelatedTransactionRepo = require('../../wealth/relatedTransactions/relatedTransactionRepo');
const Exception = require('../../features/exception');
const sequelize = require('../../db/dbConnection').getSequelize();
const DateHelper = require('../../helper/DateHelper');
const Common = require('../../utilities/common');
const TransactionModules = require('../../wealth/transactions/transactionModules').Modules;

class CardTransactionBusiness {
  async getCardsTransactions({cardId, cardInstId, cardPayment, cardIsPaid, skip, limit,
    description, includeDescription, transDateFrom, transDateTo, payForOthers}) {
    limit = Common.getNumber(limit, 10);
    skip = Common.getNumber(skip, 0);
    let cardTransactions = await CardTransactionRepo.getCardsTransactions({
      cardId, cardInstId, cardPayment, cardIsPaid, skip, limit, 
      description, includeDescription, transDateFrom, transDateTo, payForOthers});
      cardTransactions = cardTransactions.map(trans =>{
        return {
          cardTransId: trans.cardTransId,
          cardId: trans.cardId,
          cardTransAmount: trans.cardTransAmount,
          cardTransCurrency: trans.cardTransCurrency,
          cardTransDate: trans.cardTransDate,
          cardTransDesc: trans.cardTransDesc,
          cardTransBillAmount: trans.cardTransBillAmount,
          cardTransBillDate: trans.cardTransBillDate,
          cardTransIsInstallment: trans.cardTransIsInstallment,
          cardTransAccountTransId: trans.cardTransAccountTransId,
          cardTransInstallmentId: trans.cardTransInstallmentId,
          cardTransIsPaid: trans.cardTransIsPaid,
          cardTransPayForOthers: trans.cardTransPayForOthers,
          currencyDecimalPlace: trans.currency.currencyDecimalPlace,
          cardNumber: trans.card.cardNumber,
          cardBank: trans.card.cardBank,
          cardCurrency: trans.card.cardCurrency,
          bankName: trans.card.bank.bankName,
          cardCurrencyDecimalPlace: trans.card.currency.currencyDecimalPlace
        }
      });
    return cardTransactions
  }

  async getCardTransaction(id) {
    let trans = await CardTransactionRepo.getCardTransaction(id);
    trans = {
      cardTransId: trans.cardTransId,
      cardId: trans.cardId,
      cardTransAmount: trans.cardTransAmount,
      cardTransCurrency: trans.cardTransCurrency,
      cardTransDate: trans.cardTransDate,
      cardTransDesc: trans.cardTransDesc,
      cardTransBillAmount: trans.cardTransBillAmount,
      cardTransBillDate: trans.cardTransBillDate,
      cardTransIsInstallment: trans.cardTransIsInstallment,
      cardTransAccountTransId: trans.cardTransAccountTransId,
      cardTransInstallmentId: trans.cardTransInstallmentId,
      cardTransIsPaid: trans.cardTransIsPaid,
      cardTransPayForOthers: trans.cardTransPayForOthers,
      currencyDecimalPlace: trans.currency.currencyDecimalPlace,
      cardNumber: trans.card.cardNumber,
      cardBank: trans.card.cardBank,
      cardCurrency: trans.card.cardCurrency,
      bankName: trans.card.bank.bankName,
      cardCurrencyDecimalPlace: trans.card.currency.currencyDecimalPlace
    };
    return trans;
  }

  async addCardTransaction({cardId, transCurrency, transAmount, transDate, 
    transDesc, billAmount, instId, payForOthers}) {
    var card = await CardRepo.getCard(cardId);
    if(!card) throw new Exception('CARD_NOT_EXIST');
    
    let dbTransaction;
    try {
      dbTransaction = await sequelize.transaction();
      await CardTransactionRepo.addCardTransaction({
        cardId,
        cardTransAmount: transAmount,
        cardTransCurrency: transCurrency,
        cardTransDate: Common.getDate(transDate, ''),
        cardTransDesc: transDesc,
        cardTransBillAmount: billAmount,
        cardTransBillDate: null,
        cardTransIsInstallment: false,
        cardTransAccountTransId: null,
        cardTransInstallmentId: instId?instId:null,
        cardTransIsPaid: false,
        cardTransPayForOthers: payForOthers
      }, dbTransaction);
      await CardRepo.updateCardBalance(cardId, billAmount * -1, dbTransaction);
      await dbTransaction.commit();
    } catch (err) {
        console.log(`error ${err}`);
        await dbTransaction.rollback();
        throw new Exception('CARD_TRANS_ADD_FAIL');
    }
  }

  async updateCardTransaction(cardTransId, {transCurrency, transAmount, transDate, 
    transDesc, billAmount, instId, payForOthers}) {
    //var cardTrans = await this.getCardTransaction(cardTransId);
    let cardTrans = await CardTransactionRepo.getCardTransaction(cardTransId);
    if(!cardTrans) throw new Exception('CARD_TRANS_NOT_EXIST');

    if(cardTrans.cardTransIsInstallment) throw new Exception('CARD_TRANS_INST_FAIL');

    let dbTransaction;
    try {
      dbTransaction = await sequelize.transaction();
      await CardRepo.updateCardBalance(cardTrans.cardId, 
        cardTrans.cardTransBillAmount - billAmount, dbTransaction);
      cardTrans.cardTransCurrency = transCurrency;
      cardTrans.cardTransAmount = transAmount;
      cardTrans.cardTransDate = Common.getDate(transDate, '');
      cardTrans.cardTransDesc = transDesc;
      cardTrans.cardTransBillAmount = billAmount;
      cardTrans.cardTransInstallmentId = instId?instId:null;
      cardTrans.cardTransPayForOthers = payForOthers;
      await cardTrans.save({transaction: dbTransaction});
      await dbTransaction.commit();
    } catch (err) {
      console.log(`error ${err}`);
      await dbTransaction.rollback();
      throw new Exception('CARD_TRANS_UPDATE_FAIL');
    }
  }

  async deleteCardTransaction(cardTransId) {
    //var cardTrans = await this.getCardTransaction(cardTransId);
    let cardTrans = await CardTransactionRepo.getCardTransaction(cardTransId);
    if(!cardTrans) throw new Exception('CARD_TRANS_NOT_EXIST');

    let dbTransaction;
    try {
      dbTransaction = await sequelize.transaction();
      if(cardTrans.cardTransIsInstallment) {
        var cardInst = await CardInstallmentRepo.getCardInstallment(cardTrans.cardTransInstallmentId);
        if(!cardInst) throw new Exception('CARD_INST_NOT_EXIST');
        if(cardInst.cInstStatus === 'FINISHED') throw new Exception('CARD_INST_FINISHED');
        await CardInstallmentRepo.removePostInstallment(cardTrans.cardTransInstallmentId, 
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
      //const cardTrans = await this.getCardTransaction(id);
      const cardTrans = await CardTransactionRepo.getCardTransaction(id);
      if(!cardTrans) throw new Exception('CARD_TRANS_INVALID');
      if(!cardTrans.cardTransIsPaid) cardTranses.push(cardTrans);
    }
    //Check card transactions are all credits or all debits only
    //No mix between credit and debit
    let debitOrCredit = null;
    for(let cardTrans of cardTranses) {
      if (cardTrans.cardTransBillAmount === 0) throw new Exception('CARD_TRANS_PAY_AMOUNT');
      if(debitOrCredit === null) debitOrCredit = (cardTrans.cardTransBillAmount > 0 ? "C" : "D");
      else {
        if(debitOrCredit !== (cardTrans.cardTransBillAmount > 0 ? "C" : "D")) 
          throw new Exception('CARD_TRANS_PAY_MIX');
      }
    }
    //Pay
    const transactionBusiness = new TransactionBusiness();
    let errorTransIds = [];
    let dbTransaction;
    for(let cardTrans of cardTranses) {
      try {
        dbTransaction = await sequelize.transaction();
        let relId = null;
        //Check Card Installments
        if(cardTrans.cardTransIsInstallment || cardTrans.cardTransInstallmentId) {
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
        const savedTrans = await transactionBusiness.addTransaction({
          transactionAmount: Math.abs(cardTrans.cardTransBillAmount),
          transactionNarrative: 
          `${cardTrans.cardTransDesc} on ${DateHelper.getFullDateFormat(cardTrans.cardTransDate)}`,
          transactionPostingDate: Common.getDate(postingDate, ''),
          transactionCRDR: (cardTrans.cardTransBillAmount > 0 ? 'Debit' : 'Credit') ,
          transactionAccount: accountId,
          transactionTypeId: transactionTypeId,
          transactionModule: TransactionModules.CREDIT_CARD.Code,
          transactionRelatedTransactionId: relId,
          transactionModuleId: cardTrans.cardTransId,
          transactionValueDate: cardTrans.cardTransDate,
        }, dbTransaction);
        if(!savedTrans) throw new Exception('CARD_TRANS_PAY_FAIL');
        //Increase Card Balance
        await CardRepo.updateCardBalance(cardTrans.cardId, cardTrans.cardTransBillAmount, dbTransaction);
        //Save Transaction Id in Card Transaction
        cardTrans.cardTransAccountTransId = savedTrans.transactionId;
        cardTrans.cardTransIsPaid = true;
        cardTrans.cardTransBillDate = Common.getDate(postingDate, '');
        await cardTrans.save({transaction: dbTransaction});
        await dbTransaction.commit();
      } catch (err) {
        errorTransIds.push(cardTrans.cardTransId);
        console.log(`An error occured while paying Card transaction with id (${cardTrans.cardTransId}): ${err}`);
        await dbTransaction.rollback();
      }
    }
    if(errorTransIds.length>0) throw new Exception('CARD_TRANS_PAY_SOME', errorTransIds.length)
  }

  getCardInstallmentRelatedDescription(cardInst) {
    return `${cardInst.cInstItemDesc} purchased on ${DateHelper.getFullDateFormat(cardInst.cInstPurchaseDate)}`
      + ` from ${cardInst.card.cardNumber} by ${cardInst.cInstPrice} ${cardInst.cInstCurrency}`
  }
}

module.exports = CardTransactionBusiness;
