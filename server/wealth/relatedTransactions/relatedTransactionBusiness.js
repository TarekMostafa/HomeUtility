const Sequelize = require('sequelize');
//const APIResponse = require('../../utilities/apiResponse');
const RelatedTransactionRepo = require('./RelatedTransactionRepo');
const Common = require('../../utilities/common');

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

    transactions = transactions.map( trans => {
      return {
        transactionId: trans.transactionId,
        transactionAmount: trans.transactionAmount,
        transactionNarrative: trans.transactionNarrative,
        transactionPostingDate: trans.transactionPostingDate,
        transactionCRDR: trans.transactionCRDR,
        transactionAccount: trans.transactionAccount,
        accountCurrency: trans.account.accountCurrency,
        currencyDecimalPlace: trans.account.currency.currencyDecimalPlace,
        transactionTypeId: trans.transactionTypeId,
        transactionRelatedTransactionId: trans.transactionRelatedTransactionId,
        transactionModule: trans.transactionModule
      }
    });

    return relatedTransactionsByDetails;
  }
}

module.exports = RelatedTransaction;
