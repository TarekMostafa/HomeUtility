const RelatedTransactionModel = require('./relatedTransactionModel');

class RelatedTransactionRepo {
  static async addRelatedTransaction(relatedTransaction, dbTransaction) {
    return await RelatedTransactionModel.build(relatedTransaction)
    .save({transaction: dbTransaction});
  }
}

module.exports = RelatedTransactionRepo;
