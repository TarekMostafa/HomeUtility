import axios from 'axios';

class DepositRequest {
  static async getDeposits(bank, status, currency) {
    const response = await axios.get('/api/wealth/deposits', {
      params: {
        bank,
        status,
        currency
      }
    });
    return response.data;
  }

  static async getDeposit(id) {
    const response = await axios.get('/api/wealth/deposits/'+id);
    return response.data;
  }

  static async addNewDeposit(reference, accountId, amount, rate, startDate,
    endDate, transDebitType, interestTransType){
    return await axios.post('/api/wealth/deposits', {
      reference, accountId, amount, rate, startDate,
      endDate, transDebitType, interestTransType
    });
  }

  static async deleteDeposit(id){
    return await axios.delete('/api/wealth/deposits/'+id);
  }

  static async addDepositInterest(id, amount, date){
    return await axios.post('/api/wealth/deposits/interest/'+id, {
      amount, date
    });
  }

  static async releaseDeposit(id, releaseDate, transCreditType){
    return await axios.post('/api/wealth/deposits/release/'+id, {
      releaseDate, transCreditType
    });
  }
}

export default DepositRequest;
