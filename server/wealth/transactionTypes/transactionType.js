const TransactionTypeModel = require('./transactionTypeModel');
const TranasctionModel = require('../transactions/transactionModel');
const Common = require('../../common/common');

class TransactionType {
  async getTransactionTypes() {
    return await TransactionTypeModel.findAll({
      attributes: ['typeId', 'typeName', 'typeCRDR']
    });
  }

  async getTransactionType(id) {
    return await TransactionTypeModel.findByPk(id);
  }

  async addTransactionType(transactionType) {
    await TransactionTypeModel.build(transactionType).save();
    return Common.getAPIResponse(true, 'This transaction type has been successfully saved');
  }

  async updateTransactionType(id, transactionType) {
    const _transactionType = await this.getTransactionType(id);
    if(_transactionType === null) {
      return Common.getAPIResponse(false, 'This transaction type does not exist in the database for update');
    }
    // Check number of transactions used by transaction type
    // if there is a change in typeCRDR field
    if(_transactionType.typeCRDR !== transactionType.typeCRDR) {
      const count = await TranasctionModel.count({
        where: {transactionTypeId: _transactionType.typeId}
      })
      if(count > 0) {
        return Common.getAPIResponse(false,
          `You can not update the Credit/Debit field as this transaction type is used in ${count} transaction(s)`);
      }
    }
    _transactionType.typeName = transactionType.typeName;
    _transactionType.typeCRDR = transactionType.typeCRDR;
    await _transactionType.save();
    return Common.getAPIResponse(true, 'This transaction type has been successfully updated');
  }

  async deleteTransactionType(id) {
    const _transactionType = await this.getTransactionType(id);
    if(_transactionType === null) {
      return Common.getAPIResponse(false, 'This transaction type does not exist in the database for deletion');
    }
    await _transactionType.destroy();
    return Common.getAPIResponse(true, 'This transaction type has been successfully deleted');
  }
}

module.exports = TransactionType;
