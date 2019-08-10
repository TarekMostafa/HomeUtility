const RelatedTransactionModel = require('./relatedTransactionModel');
const RelatedTypeModel = require('../relatedTypes/relatedTypeModel');
const TransactionRepo = require('../transactions/transactionRepo');

class RelatedTransactionRepo {
  static async addRelatedTransaction(relatedTransaction, dbTransaction) {
    return await RelatedTransactionModel.build(relatedTransaction)
    .save({transaction: dbTransaction});
  }

  static async getRelatedTransactions(skip, limit, whereQuery) {
    return await RelatedTransactionModel.findAll({
      offset: skip,
      limit: limit,
      attributes: ['relatedTransactionsId', 'relatedTransactionType', 'relatedTransactionDesc'],
      include: [
        {model: RelatedTypeModel, as: 'relatedType', attributes: ['typeDescription']}
      ],
      where: whereQuery,
      order: [['relatedTransactionsId', 'DESC']]
    });
  }

  static async getRelatedTransactionsById(id) {
    //Get Related Transaction Details
    const relatedTransaction = await RelatedTransactionModel.findByPk(id);
    //Get Real Transactions
    let whereQuery = {};
    whereQuery.transactionRelatedTransactionId = id;
    const transactions = await TransactionRepo.getTransactions(0, 999, whereQuery);
    //Attach transactions to related Transactions
    let relatedTransactionDetails = {}
    relatedTransactionDetails.relatedTransaction = relatedTransaction;
    relatedTransactionDetails.transactions = transactions;
    return relatedTransactionDetails;
  }
}

module.exports = RelatedTransactionRepo;
