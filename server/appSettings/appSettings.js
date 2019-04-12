const AppSettingsModel = require('./appSettingsModel');
const Currency = require('../currencies/currency');
const Common = require('../common/common');
const APP_SETTING_KEY = 'APP';

class AppSettings {

  async getAppSettings() {
    return await AppSettingsModel.findByPk(APP_SETTING_KEY);
  }

  async updateAppSettings({baseCurrency}) {
    let appSettings = await AppSettingsModel.findByPk(APP_SETTING_KEY);
    if(appSettings === null) {
      return Common.getAPIResponse(false, `An error occurred while retrieving application settings`);
    }
    appSettings.baseCurrency = baseCurrency;
    await appSettings.save();
    const currency = new Currency();
    await currency.updateRates();
    return Common.getAPIResponse(true, 'Application settings have been successfully updated');
  }
}

module.exports = AppSettings;
