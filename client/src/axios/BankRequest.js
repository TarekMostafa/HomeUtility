import axios from 'axios';

class BankRequest {
  static async getBanks () {
    const response = await axios.get('/api/wealth/banks');
    return response.data;
  }
}

export default BankRequest;
