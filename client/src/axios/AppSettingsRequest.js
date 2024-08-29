import axios from 'axios';

class AppSettingsRequest {
  static async getAppSettings() {
    const response = await axios.get('/api/appsettings');
    return response.data;
  }

  static async updateAppSettings(baseCurrency) {
    return await axios.put('/api/appsettings/', {
      newBaseCurrency: baseCurrency
    });
  }
}

export default AppSettingsRequest;
