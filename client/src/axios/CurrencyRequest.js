import axios from 'axios';

class CurrencyRequest {
  static async getCurrencies(active) {
    const response = await axios.get('/api/currencies', {
      params: {
        active
      }
    });
    return response.data;
  }

  static async activateCurrency(code) {
    const response = await axios.post('/api/currencies/activate', {
      code
    });
    console.log(response);
  }

  static async deactivateCurrency(code) {
    const response = await axios.post('/api/currencies/deactivate', {
      code
    });
    console.log(response);
  }
}

export default CurrencyRequest;
