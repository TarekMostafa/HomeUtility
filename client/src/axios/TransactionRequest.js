import axios from 'axios';

class TransctionRequest {
  static async getTransactions (limit, skip, accountId, typeId, postingDateFrom,
    postingDateTo, narrative) {
    const response = await axios.get('/api/wealth/transactions', {
      params: {
        limit,
        skip,
        accountId,
        typeId,
        postingDateFrom,
        postingDateTo,
        narrative
      }
    });
    return response.data;
  }
}

export default TransctionRequest;
