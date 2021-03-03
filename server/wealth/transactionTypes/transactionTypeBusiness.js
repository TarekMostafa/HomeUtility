const TransactionTypeRepo = require('./transactionTypeRepo');
const TranasctionRepo = require('../transactions/transactionRepo');
const APIResponse = require('../../utilities/apiResponse');

class transactionTypeBusiness {
  async getTransactionTypes() {
    const transactionTypes = await TransactionTypeRepo.getTransactionTypes();
    return APIResponse.getAPIResponse(true, transactionTypes);
  }

  async addTransactionType(transactionType) {
    await TransactionTypeRepo.addTransactionType(transactionType);
    return APIResponse.getAPIResponse(true, null, '017');
  }

  async updateTransactionType(id, transactionType) {
    const _transactionType = await TransactionTypeRepo.getTransactionType(id);
    if(!_transactionType) {
      return APIResponse.getAPIResponse(false, null, '018');
    }
    // Check number of transactions used by transaction type
    // if there is a change in typeCRDR field
    if(_transactionType.typeCRDR !== transactionType.typeCRDR) {
      const count = await TranasctionRepo.getTransactionsCountByTransactionType(_transactionType.typeId);
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
    const _transactionType = await TransactionTypeRepo.getTransactionType(id);
    if(!_transactionType) {
      return APIResponse.getAPIResponse(false, null, '018');
    }
    await _transactionType.destroy();
    return APIResponse.getAPIResponse(true, null, '021');
  }
}

module.exports = transactionTypeBusiness;
