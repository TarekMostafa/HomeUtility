const TransactionTypeModel = require('./transactionTypeModel');

class TransactionTypeRepo {
  static async getTransactionTypes() {
    return await TransactionTypeModel.findAll({
      attributes: ['typeId', 'typeName', 'typeCRDR']
    });
  }

  static async getTransactionType(id) {
    return await TransactionTypeModel.findByPk(id);
  }

  static async addTransactionType(transactionType) {
    await TransactionTypeModel.build(transactionType).save();
  }
}

module.exports = TransactionTypeRepo;
