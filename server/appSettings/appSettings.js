const AppSettingsRepo = require('./appSettingsRepo');
const APIResponse = require('../utilities/apiResponse');

class AppSettings {

  async getAppSettings() {
    const appSettings = await AppSettingsRepo.getAppSettingsWithCurrency();
    if(appSettings) {
      return APIResponse.getAPIResponse(true, appSettings);
    } else {
      return APIResponse.getAPIResponse(false, null, '001');
    }
  }

  async updateAppSettings({baseCurrency}) {
    let appSettings = await AppSettingsRepo.getAppSettings();
    if(!appSettings) {
      return APIResponse.getAPIResponse(false, null, '001');
    }
    appSettings.baseCurrency = baseCurrency;
    await appSettings.save();
    return APIResponse.getAPIResponse(true, null, '002');
  }
}

module.exports = AppSettings;
