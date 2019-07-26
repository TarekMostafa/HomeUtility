const RelatedTransactionModel = require('./relatedTransactionModel');
const RelatedTypeModel = require('../relatedTypes/RelatedTypeModel');

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
}

module.exports = RelatedTransactionRepo;
