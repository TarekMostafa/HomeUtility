const TransactionTypeModel = require('./transactionTypeModel');

class TransactionType {
  async getTransactionTypesForDropDown() {
    return await TransactionTypeModel.findAll({
      attributes: ['typeId', 'typeName', 'typeCRDR']
    });
  }
}

module.exports = TransactionType;
