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

  static async addCurrency(code, name, decimalPlace) {
    return await axios.post('/api/currencies/', {
      currencyCode: code,
      currencyName: name,
      currencyDecimalPlace: decimalPlace,
    });
  }

  static async updateCurrency(code, manualRate) {
    return await axios.put('/api/currencies/', {
      code,
      manualRate,
    });
  }

  static async activateCurrency(code) {
    return await axios.put('/api/currencies/activate', {
      code
    });
  }

  static async deactivateCurrency(code) {
    return await axios.put('/api/currencies/deactivate', {
      code
    });
  }

  static async getCurrencyInfoByCurrencyCode(code) {
    const response = await axios.get('/api/currencies/currencyInfo', {
      params: {
        code
      }
    });
    return response.data;
  }

  static async updateRates() {
    return await axios.put('/api/currencies/updaterates');
  }
}

export default CurrencyRequest;
