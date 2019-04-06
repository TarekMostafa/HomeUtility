import axios from 'axios';

class TransactionTypeRequest {
  static async getTransactionTypesForDropDown () {
    const response = await axios.get('/api/wealth/transactiontypes/dropdown');
    return response.data;
  }
}

export default TransactionTypeRequest;
