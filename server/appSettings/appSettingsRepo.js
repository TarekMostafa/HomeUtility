const AppSettingsModel = require('./appSettingsModel');
const CurrencyModel = require('../currencies/CurrencyModel');

const APP_SETTING_KEY = 'APP';

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
