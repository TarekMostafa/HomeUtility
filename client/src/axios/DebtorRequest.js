import axios from 'axios';

class DebtorRequest {
  static async getDebtors(currency, status) {
    const response = await axios.get('/api/debt/debtor', {
        params: {
          currency, status
        }
      });
    return response.data;
  }

  static async getDebtor(id) {
    const response = await axios.get('/api/debt/debtor/'+id);
    return response.data;
  }

  static async addDebtor(debtName, debtCurrency, debtNotes) {
    return await axios.post('/api/debt/debtor', {
        debtName, debtCurrency, debtNotes
    });
  }

  static async updateDebtor(id, debtName, debtNotes, debtStatus) {
    return await axios.put('/api/debt/debtor/'+id, {
        debtName, debtNotes, debtStatus
    });
  }

  static async updateExemptionAmount(id, exemptionAmount) {
    return await axios.put('/api/debt/debtor/exemption/'+id, {
      exemptionAmount
    });
  }

  static async deleteDebtor(id) {
    return await axios.delete('/api/debt/debtor/'+id);
  }

}

export default DebtorRequest;
