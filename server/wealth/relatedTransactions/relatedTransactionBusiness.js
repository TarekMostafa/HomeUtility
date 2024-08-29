const Sequelize = require('sequelize');
//const APIResponse = require('../../utilities/apiResponse');
const RelatedTransactionRepo = require('./RelatedTransactionRepo');
const Common = require('../../utilities/common');
const AmountHelper = require('../../helper/AmountHelper');

const Op = Sequelize.Op;

class RelatedTransaction {

  async getRelatedTransactions({limit, skip, type,
    description, id, includeDescription}) {

    limit = Common.getNumber(limit, 10);
    skip = Common.getNumber(skip, 0);
    // Construct Where Condition
    let whereQuery = {};
    // Type
    if(type) {
      whereQuery.relatedTransactionType = type;
    }
    // Description
    if(description) {
      if(includeDescription==='true') {
        whereQuery.relatedTransactionDesc = {
          [Op.substring] : description
        }
      } else {
        whereQuery.relatedTransactionDesc = {
          [Op.notLike] : '%'+description.trim()+'%'
        }
      }
    }
    //Related Transaction Id
    if(id){
      whereQuery.relatedTransactionsId = id;
    }

    let relatedTransactions = await RelatedTransactionRepo.getRelatedTransactions(skip, limit, whereQuery);
    relatedTransactions = relatedTransactions.map( reltrans => {
      return {
        relatedTransactionsId: reltrans.relatedTransactionsId,
        relatedTransactionType: reltrans.relatedTransactionType,
        relatedTransactionDesc: reltrans.relatedTransactionDesc,
        typeDescription: reltrans.relatedType.typeDescription
      }
    });

    return relatedTransactions;
  }

  async getRelatedTransactionsDetails({id}) {
    let relatedTransactionsByDetails = await RelatedTransactionRepo.getRelatedTransactionsById(id);
    let { relatedTransaction, transactions} = relatedTransactionsByDetails;
    
    relatedTransaction = {
      relatedTransactionsId: relatedTransaction.relatedTransactionsId,
      relatedTransactionType: relatedTransaction.relatedTransactionType,
      relatedTransactionDesc: relatedTransaction.relatedTransactionDesc,
    };

    let debitCurrencyDecimalPlace = 0;
    let creditCurrencyDecimalPlace = 0;
    let debitCurrencyCode = '';
    let creditCurrencyCode = '';

    transactions = transactions.map( trans => {
      //Get currency details for debits
      if(!debitCurrencyCode && trans.transactionCRDR === 'Debit'){
        debitCurrencyCode = trans.account.accountCurrency;
        debitCurrencyDecimalPlace = trans.account.currency.currencyDecimalPlace;
      }
      //Get currency details for credits
      if(!creditCurrencyCode && trans.transactionCRDR === 'Credit'){
        creditCurrencyCode = trans.account.accountCurrency;
        creditCurrencyDecimalPlace = trans.account.currency.currencyDecimalPlace;
      }

      return {
        transactionId: trans.transactionId,
        transactionPostingDate: trans.transactionPostingDate,
        transactionAmount: trans.transactionAmount,
        transactionAmountFormatted: 
          AmountHelper.formatAmount(trans.transactionAmount, trans.account.currency.currencyDecimalPlace),
        transactionCRDR: trans.transactionCRDR,
        transactionNarrative: trans.transactionNarrative,
        transactionRelatedTransactionId: trans.transactionRelatedTransactionId,
        transactionModule: trans.transactionModule,
        accountNumber: trans.account.accountNumber,
        accountCurrency: trans.account.accountCurrency,
        currencyRateAgainstBase: trans.account.currency.currencyRateAgainstBase,
        currencyDecimalPlace: trans.account.currency.currencyDecimalPlace,
        typeName: (trans.transactionType? trans.transactionType.typeName: ''),
      }
    });

    //Calculate total for debits
    const totalDebit = transactions.reduce( 
      (acc, trans) => {
        if(trans.transactionCRDR === 'Debit')
          return Number(acc)+Number(trans.transactionAmount);
        else
          return Number(acc);
      }, 0);
    //Calculate total for credits
    const totalCredit = transactions.reduce( 
      (acc, trans) => {
        if(trans.transactionCRDR === 'Credit')
          return Number(acc)+Number(trans.transactionAmount);
        else
          return Number(acc);
      }, 0);

    relatedTransactionsByDetails = {
      relatedTransaction,
      transactions,
      totalDebitFormatted: AmountHelper.formatAmount(totalDebit, debitCurrencyDecimalPlace) + 
        ' ' + debitCurrencyCode,
      totalCreditFormatted: AmountHelper.formatAmount(totalCredit, creditCurrencyDecimalPlace) +
        ' ' + creditCurrencyCode,
    }

    return relatedTransactionsByDetails;
  }
}

module.exports = RelatedTransaction;
