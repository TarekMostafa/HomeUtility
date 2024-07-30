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

  static async getFXTransactions (currency, againstCurrency, dateFrom, dateTo) {
    const response = await axios.get('/api/wealth/transactions/fx', {
      params: {
        currency,
        againstCurrency,
        dateFrom,
        dateTo
      }
    });
    return response.data;
  }

  static async getAccountBalanceAsOfDate (accountId, balanceDate) {
    const response = await axios.get('/api/wealth/transactions/accountbalanceasofdate', {
      params: {
        accountId,
        balanceDate
      }
    });
    return response.data;
  }

  static async getMonthlyStatistics (postingDateFrom, postingDateTo, reportId, currency) {
    const response = await axios.get('/api/wealth/transactions/monthlystatistics', {
      params: {
        postingDateFrom,
        postingDateTo,
        reportId,
        currency
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

  static async getFXTransaction(id) {
    const response = await axios.get('/api/wealth/transactions/fx/'+id);
    return response.data;
  }

  static async getInternalTransactionDefaults(){
    const response = await axios.get('/api/wealth/transactions/internal/getDefaults/');
    return response.data;
  }

  static async addDebtTransaction (account, postingDate, amount, crOrDr, debtorId, narrative) {
    return await axios.post('/api/wealth/transactions/debt', {
      account,
      postingDate,
      amount,
      crOrDr,
      debtorId,
      narrative
    });
  }

  static async updateDebtTransaction (id, account, postingDate, amount, crOrDr, debtorId, narrative) {
    return await axios.put('/api/wealth/transactions/debt/'+id, {
      account,
      postingDate,
      amount,
      crOrDr,
      debtorId,
      narrative
    });
  }

  static async deleteDebtTransaction (id) {
    return await axios.delete('/api/wealth/transactions/debt/'+id);
  }

  static async convertToDebtTransaction(id, debtorId) {
    return await axios.post('/api/wealth/transactions/debt/converttodebt/'+id, {
      debtorId
    });
  }

  static async linkToDebtor(id, debtorId) {
    return await axios.post('/api/wealth/transactions/debt/linktodebtor/'+id, {
      debtorId
    });
  }

  static async releaseFromDebtor(id, debtorId) {
    return await axios.post('/api/wealth/transactions/debt/releasefromdebtor/'+id, {
      debtorId
    });
  }

  static async getFXTransactionDefaults(){
    const response = await axios.get('/api/wealth/transactions/fx/getDefaults/');
    return response.data;
  }

  static async addFXTransaction (accountFrom, accountTo, typeFrom, typeTo, postingDateFrom, 
      rate, amountFrom, amountTo, postingDateTo) {
    return await axios.post('/api/wealth/transactions/fx', {
      accountFrom,
      accountTo,
      typeFrom,
      typeTo,
      postingDateFrom,
      rate,
      amountFrom,
      amountTo,
      postingDateTo
    });
  }

  static async deleteFXTransaction(fxId, fromId, toId) {
    return await axios.post('/api/wealth/transactions/fx/delete/'+fxId, {
      fromId, toId 
    });
  }
}

export default TransctionRequest;
