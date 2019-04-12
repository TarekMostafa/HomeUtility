const AppSettingsModel = require('./appSettingsModel');
const Common = require('../common/common');

class AppSettings {

  async getAppSettings() {
    return await AppSettingsModel.findByPk('APP');
  }

  async updateAppSettings({baseCurrency}) {
    let appSettings = await AppSettingsModel.findByPk('APP');
    if(appSettings === null) {
      return Common.getAPIResponse(false, `An error occurred while retrieving application settings`);
    }
    appSettings.baseCurrency = baseCurrency;
    await appSettings.save();
    return Common.getAPIResponse(true, 'Application settings have been successfully updated');
  }
}

module.exports = AppSettings;
