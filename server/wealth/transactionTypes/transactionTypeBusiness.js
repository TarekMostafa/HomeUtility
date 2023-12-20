const TransactionTypeRepo = require('./transactionTypeRepo');
const TranasctionRepo = require('../transactions/transactionRepo');
const Exception = require('../../features/exception');

class transactionTypeBusiness {
  async getTransactionTypes() {
    let transTypes = await TransactionTypeRepo.getTransactionTypes();
    transTypes = transTypes.map(transType => {
      return {
        typeId: transType.typeId,
        typeName: transType.typeName,
        typeCRDR: transType.typeCRDR,
      }
    });
    return transTypes;
  }

  async addTransactionType({typeName, typeCRDR}) {
    await TransactionTypeRepo.addTransactionType({
      typeName, typeCRDR
    });
  }

  async updateTransactionType(id, {typeName, typeCRDR}) {
    const transactionType = await TransactionTypeRepo.getTransactionType(id);
    if(!transactionType) throw new Exception('TRNS_TYP_NOT_EXIST');
    
    // Check number of transactions used by transaction type
    // if there is a change in typeCRDR field
    if(transactionType.typeCRDR !== typeCRDR) {
      const count = await TranasctionRepo.getTransactionsCountByTransactionType(transactionType.typeId);
      if(count > 0) throw new Exception('TRNS_TYP_CRDB_ERR', count);
    }

    transactionType.typeName = typeName;
    transactionType.typeCRDR = typeCRDR;
    await transactionType.save();
  }

  async deleteTransactionType(id) {
    const transactionType = await TransactionTypeRepo.getTransactionType(id);
    if(!transactionType) throw new Exception('TRNS_TYP_NOT_EXIST');

    // Check number of transactions used by transaction type
    const count = await TranasctionRepo.getTransactionsCountByTransactionType(transactionType.typeId);
    if(count > 0) throw new Exception('TRNS_TYP_DELETE_ERR', count);

    await transactionType.destroy();
  }
}

module.exports = transactionTypeBusiness;
