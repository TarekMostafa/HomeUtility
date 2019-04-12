import axios from 'axios';

class BankRequest {
  static async getBanks () {
    const response = await axios.get('/api/wealth/banks');
    return response.data;
  }

  static async addBank(code, name) {
    return await axios.post('/api/wealth/banks', {
      bankCode: code,
      bankName: name,
    });
  }

  static async updateBank(code, name) {
    return await axios.put('/api/wealth/banks/'+code, {
      bankName: name,
    });
  }

  static async deleteBank(code) {
    return await axios.delete('/api/wealth/banks/'+code);
  }
}

export default BankRequest;
