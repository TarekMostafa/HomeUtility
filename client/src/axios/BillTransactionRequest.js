import axios from 'axios';

class BillTransactionRequest {
  static async getBillsTransactions(limit, skip, billId, billDateFrom, billDateTo, 
    postingDateFrom, postingDateTo, includeNotes, notes, amountType) {
    const response = await axios.get('/api/billsTransactions', {
      params: {
        limit,
        skip,
        billId,
        billDateFrom,
        billDateTo,
        postingDateFrom,
        postingDateTo,
        includeNotes,
        notes,
        amountType
      }
    });
    return response.data;
  }

  static async getBillTransaction(id) {
    const response = await axios.get('/api/billsTransactions/'+id);
    return response.data;
  }

  static async addBillTransaction(amount, billDate, notes, outOfFreq, amountType, billId, postingDate, transDetails){
    return await axios.post('/api/billsTransactions', {
      transAmount: amount,
      transBillDate: billDate,
      transNotes: notes,
      transOutOfFreq: outOfFreq,
      transAmountType: amountType,
      billId: billId,
      transPostingDate: postingDate,
      billTransactionDetails: transDetails
    });
  }

  static async updateBillTransaction(id, amount, billDate, notes, outOfFreq, amountType, postingDate, transDetails){
    return await axios.put('/api/billsTransactions/'+id, {
      transAmount: amount,
      transBillDate: billDate,
      transNotes: notes,
      transOutOfFreq: outOfFreq,
      transAmountType: amountType,
      transPostingDate: postingDate,
      billTransactionDetails: transDetails
    });
  }

  static async deleteBillTransaction(id){
    return await axios.delete('/api/billsTransactions/'+id);
  }
}

export default BillTransactionRequest;
