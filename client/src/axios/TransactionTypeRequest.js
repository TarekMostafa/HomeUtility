import axios from 'axios';

class TransactionTypeRequest {
  static async getTransactionTypes() {
    const response = await axios.get('/api/wealth/transactiontypes');
    return response.data;
  }

  static async addTransactionType(typeName, typeCRDR) {
    return await axios.post('/api/wealth/transactiontypes', {
      typeName,
      typeCRDR,
    });
  }

  static async updateTransactionType(typeId, typeName, typeCRDR) {
    return await axios.put('/api/wealth/transactiontypes/'+typeId, {
      typeName,
      typeCRDR,
    });
  }

  static async deleteTransactionType(typeId) {
    return await axios.delete('/api/wealth/transactiontypes/'+typeId);
  }

}

export default TransactionTypeRequest;
