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

  static async updateSingleTransaction (id, account, postingDate, amount, crdr, type, narrative) {
    return await axios.put('/api/wealth/transactions/single/'+id, {
      transactionAmount: amount,
      transactionNarrative: narrative,
      transactionPostingDate: postingDate,
      transactionCRDR: crdr,
      transactionAccount: account,
      transactionTypeId: type,
    });
  }

  static async getSingleTransaction(id) {
    const response = await axios.get('/api/wealth/transactions/single/'+id);
    return response.data;
  }
}

export default TransctionRequest;
