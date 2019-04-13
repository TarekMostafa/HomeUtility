const CurrencyCodes = require('currency-codes');
const _ = require('lodash');

const CurrencyModel = require('./currencyModel');
const AppSettingsModel = require('../appSettings/appSettingsModel');
const Common = require('../common/common');
const currencyConversion = require('./currencyConversion');

class Currency {

  async getCurrencies({active}) {
    // Construct Where Condition
    let whereQuery = {};
    // Check active query
    if(Common.getText(active, '') !== '') {
      whereQuery.currencyActive = active;
    }
    return await CurrencyModel.findAll({
      where: whereQuery
    });
  }

  async getCurrencyByCurrencyCode(code) {
    return await CurrencyModel.findByPk(code);
  }

  async getCurrencyInfoFromThirdParty({code}){
    return await CurrencyCodes.code(code);
  }

  async addCurrency(currency){
    const _currency = await this.getCurrencyByCurrencyCode(currency.currencyCode);
    if(_currency !== null) {
      return Common.getAPIResponse(false, 'This currency code already exists in the database');
    }
    await CurrencyModel.build(currency).save();
    return Common.getAPIResponse(true, 'This currency has been successfully saved');
  }

  async activateCurrency({code}) {
    let currency = await this.getCurrencyByCurrencyCode(code);
    if(currency === null) {
      return Common.getAPIResponse(false, `This currency (${code}) does not exist in the database`);
    }
    currency.currencyActive = 'YES';
    await currency.save();
    return Common.getAPIResponse(true, 'This currency has been successfully activated');
  }

  async deactivateCurrency({code}) {
    let currency = await this.getCurrencyByCurrencyCode(code);
    if(currency === null) {
      return Common.getAPIResponse(false, `This currency (${code}) does not exist in the database`);
    }
    // Get Base Currency
    const appSettings = await AppSettingsModel.findByPk('APP');
    if(!_.isNil(appSettings.baseCurrency))
    {
      //Check base currency with the passed one
      if(appSettings.baseCurrency === currency.currencyCode) {
        return Common.getAPIResponse(false, `We can not deactivate the base currency (${code})`);
      }
    }
    currency.currencyActive = 'NO';
    await currency.save();
    return Common.getAPIResponse(true, 'This currency has been successfully deactivated');
  }

  async updateRates() {
    // Get Base Currency
    const appSettings = await AppSettingsModel.findByPk('APP');
    if(_.isNil(appSettings.baseCurrency))
    {
      return Common.getAPIResponse(false, `There is no base currency in the application settings`);
    }
    // Get list of active currencies
    const currencies = await this.getCurrencies({active:true});
    // Create promises array to get all rates based on base currency
    let promises = currencies.map( (currency) => {
      return new Promise( (resolve) => {
        currencyConversion(currency.currencyCode, appSettings.baseCurrency,
          appSettings.currencyConversionAPIKey, function(err, amt){
          currency.currencyRateAgainstBase = amt;
          resolve(currency);
        });
      });
    });
    // Wait for rates and update database
    return await Promise.all(promises).then( (data) => {
      return data.map( currency => currency.save());
    });
  }
}

module.exports = Currency;
