const CurrencyCodes = require('currency-codes');
const _ = require('lodash');

const CurrencyModel = require('./currencyModel');
const AppSettingsModel = require('../appSettings/appSettingsModel');
const Common = require('../utilities/common');
const APIResponse = require('../utilities/apiResponse');
const currencyConversion = require('./currencyConversion');

class Currency {

  async getCurrencies({active}) {
    // Construct Where Condition
    let whereQuery = {};
    // Check active query
    if(Common.getText(active, '') !== '') {
      whereQuery.currencyActive = active;
    }
    const currencies = await CurrencyModel.findAll({
      where: whereQuery
    });
    return APIResponse.getAPIResponse(true, currencies);
  }

  async getCurrencyByCurrencyCode(code) {
    return await CurrencyModel.findByPk(code);
  }

  async getCurrencyInfoFromThirdParty({code}){
    const currency = await CurrencyCodes.code(code);
    if(currency) {
      return APIResponse.getAPIResponse(true, currency);
    } else {
      return APIResponse.getAPIResponse(false, null, '022');
    }
  }

  async addCurrency(currency){
    const _currency = await this.getCurrencyByCurrencyCode(currency.currencyCode);
    if(_currency) {
      return APIResponse.getAPIResponse(false, null, '005');
    }
    await CurrencyModel.build(currency).save();
    return APIResponse.getAPIResponse(true, null, '006');
  }

  async activateCurrency({code}) {
    let currency = await this.getCurrencyByCurrencyCode(code);
    if(!currency) {
      return APIResponse.getAPIResponse(false, null, '007', code);
    }
    currency.currencyActive = 'YES';
    await currency.save();
    return APIResponse.getAPIResponse(true, null, '008');
  }

  async deactivateCurrency({code}) {
    let currency = await this.getCurrencyByCurrencyCode(code);
    if(!currency) {
      return APIResponse.getAPIResponse(false, null, '007', code);
    }
    // Get Base Currency
    const appSettings = await AppSettingsModel.findByPk('APP');
    if(!_.isNil(appSettings.baseCurrency))
    {
      //Check base currency with the passed one
      if(appSettings.baseCurrency === currency.currencyCode) {
        return APIResponse.getAPIResponse(false, null, '009', code);
      }
    }
    currency.currencyActive = 'NO';
    await currency.save();
    return APIResponse.getAPIResponse(true, null, '010');
  }

  async updateRates() {
    // Get Base Currency
    const appSettings = await AppSettingsModel.findByPk('APP');
    if(_.isNil(appSettings.baseCurrency))
    {
      return APIResponse.getAPIResponse(false, null, '011');
    }
    // Get list of active currencies
    const currencies = await CurrencyModel.findAll(
      { where: {currencyActive:true} }
    );
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
    await Promise.all(promises).then( (data) => {
      return data.map( currency => currency.save());
    });
    return APIResponse.getAPIResponse(true, null, '023');
  }
}

module.exports = Currency;
