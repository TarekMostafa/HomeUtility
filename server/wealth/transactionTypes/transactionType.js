const TransactionTypeModel = require('./transactionTypeModel');
const TranasctionModel = require('../transactions/transactionModel');
const APIResponse = require('../../utilities/apiResponse');

class TransactionType {
  async getTransactionTypes() {
    const transactionTypes = await TransactionTypeModel.findAll({
      attributes: ['typeId', 'typeName', 'typeCRDR']
    });
    return APIResponse.getAPIResponse(true, transactionTypes);
  }

  async getTransactionType(id) {
    return await TransactionTypeModel.findByPk(id);
  }

  async addTransactionType(transactionType) {
    await TransactionTypeModel.build(transactionType).save();
    return APIResponse.getAPIResponse(true, null, '017');
  }

  async updateTransactionType(id, transactionType) {
    const _transactionType = await this.getTransactionType(id);
    if(_transactionType === null) {
      return APIResponse.getAPIResponse(false, null, '018');
    }
    // Check number of transactions used by transaction type
    // if there is a change in typeCRDR field
    if(_transactionType.typeCRDR !== transactionType.typeCRDR) {
      const count = await TranasctionModel.count({
        where: {transactionTypeId: _transactionType.typeId}
      })
      if(count > 0) {
        return APIResponse.getAPIResponse(false, null, '019', count);
      }
    }
    _transactionType.typeName = transactionType.typeName;
    _transactionType.typeCRDR = transactionType.typeCRDR;
    await _transactionType.save();
    return APIResponse.getAPIResponse(true, null, '020');
  }

  async deleteTransactionType(id) {
    const _transactionType = await this.getTransactionType(id);
    if(_transactionType === null) {
      return APIResponse.getAPIResponse(false, null, '018');
    }
    await _transactionType.destroy();
    return APIResponse.getAPIResponse(true, null, '021');
  }
}

module.exports = TransactionType;
