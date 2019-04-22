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

  static async addSingleTransaction (account, postingDate, amount, crdr, type, narrative) {
    return await axios.post('/api/wealth/transactions/single', {
      transactionAmount: amount,
      transactionNarrative: narrative,
      transactionPostingDate: postingDate,
      transactionCRDR: crdr,
      transactionAccount: account,
      transactionTypeId: type,
    });
  }
}

export default TransctionRequest;
