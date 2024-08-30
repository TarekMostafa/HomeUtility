const AppSettingsModel = require('./appSettingsModel');
const CurrencyModel = require('../currencies/CurrencyModel');
const Config = require('../config');

const APP_SETTING_KEY = Config.appSettingKey;

class AppSettingsRepo {
  static async getAppSettings() {
    return await AppSettingsModel.findByPk(APP_SETTING_KEY);
  }

  static async getAppSettingsWithCurrency() {
    return await AppSettingsModel.findByPk(APP_SETTING_KEY, {
      include: [
        { model: CurrencyModel, as: 'currency', attributes: ['currencyRateAgainstBase', 'currencyDecimalPlace'] }
      ]
    });
  }
}

module.exports = AppSettingsRepo;
