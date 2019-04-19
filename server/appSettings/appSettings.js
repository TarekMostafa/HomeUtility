const AppSettingsModel = require('./appSettingsModel');
const Currency = require('../currencies/currency');
const CurrencyModel = require('../currencies/CurrencyModel');
const APIResponse = require('../utilities/apiResponse');
const APP_SETTING_KEY = 'APP';

class AppSettings {

  async getAppSettings() {
    const appSettings = await AppSettingsModel.findByPk(APP_SETTING_KEY, {
      include: [
        { model: CurrencyModel, as: 'currency', attributes: ['currencyRateAgainstBase', 'currencyDecimalPlace'] }
      ]
    });
    if(appSettings) {
      return APIResponse.getAPIResponse(true, appSettings);
    } else {
      return APIResponse.getAPIResponse(false, null, '001');
    }
  }

  async updateAppSettings({baseCurrency}) {
    let appSettings = await AppSettingsModel.findByPk(APP_SETTING_KEY);
    if(!appSettings) {
      return APIResponse.getAPIResponse(false, null, '001');
    }
    appSettings.baseCurrency = baseCurrency;
    await appSettings.save();
    const currency = new Currency();
    await currency.updateRates();
    return APIResponse.getAPIResponse(true, null, '002');
  }
}

module.exports = AppSettings;
