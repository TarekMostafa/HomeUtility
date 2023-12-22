import axios from 'axios';

class TransctionRequest {
  static async getTransactions (limit, skip, accountIds, typeIds, postingDateFrom,
    postingDateTo, narrative, id, includeNarrative) {
    const response = await axios.get('/api/wealth/transactions', {
      params: {
        limit,
        skip,
        accountIds,
        typeIds,
        postingDateFrom,
        postingDateTo,
        narrative,
        id,
        includeNarrative
      }
    });
    return response.data;
  }

  static async getMonthlyStatistics (postingDateFrom, postingDateTo, reportId) {
    const response = await axios.get('/api/wealth/transactions/monthlystatistics', {
      params: {
        postingDateFrom,
        postingDateTo,
        reportId
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

  static async addInternalTransaction (accountFrom, typeFrom, postingDate, amount, accountTo, typeTo) {
    return await axios.post('/api/wealth/transactions/internal', {
      accountFrom,
      typeFrom,
      postingDate,
      amount,
      accountTo,
      typeTo
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

  static async deleteSingleTransaction(id) {
    return await axios.delete('/api/wealth/transactions/single/'+id);
  }

  static async getSingleTransaction(id) {
    const response = await axios.get('/api/wealth/transactions/single/'+id);
    return response.data;
  }
}

export default TransctionRequest;
