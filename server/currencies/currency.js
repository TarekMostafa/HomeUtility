const CurrencyCodes = require('currency-codes');

const CurrencyRepo = require('./currencyRepo');
const AppSettingsRepo = require('../appSettings/appSettingsRepo');
const APIResponse = require('../utilities/apiResponse');
const currencyConversion = require('./currencyConversion');

class Currency {

  async getCurrencies({active}) {
    // Construct Where Condition
    let whereQuery = {};
    // Check active property
    if(active) {
      whereQuery.currencyActive = active;
    }
    const currencies = await CurrencyRepo.getCurrencies(whereQuery);
    return APIResponse.getAPIResponse(true, currencies);
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
    const _currency = await CurrencyRepo.getCurrency(currency.currencyCode);
    if(_currency) {
      return APIResponse.getAPIResponse(false, null, '005');
    }
    await CurrencyRepo.addCurrency(currency);
    return APIResponse.getAPIResponse(true, null, '006');
  }

  async activateCurrency({code}) {
    let currency = await CurrencyRepo.getCurrency(code);
    if(!currency) {
      return APIResponse.getAPIResponse(false, null, '007', code);
    }
    currency.currencyActive = 'YES';
    await currency.save();
    return APIResponse.getAPIResponse(true, null, '008');
  }

  async deactivateCurrency({code}) {
    let currency = await CurrencyRepo.getCurrency(code);
    if(!currency) {
      return APIResponse.getAPIResponse(false, null, '007', code);
    }
    // Get Base Currency
    const appSettings = await AppSettingsRepo.getAppSettings();
    if(appSettings.baseCurrency)
    {
      //Check base currency with the passed one
      if(appSettings.baseCurrency === currency.currencyCode) {
        return APIResponse.getAPIResponse(false, null, '009', code);
      }
    }
    currency.currencyActive = 'NO';
    currency.currencyRateAgainstBase = 1;
    await currency.save();
    return APIResponse.getAPIResponse(true, null, '010');
  }

  async updateRates() {
    // Get Base Currency
    const appSettings = await AppSettingsRepo.getAppSettings();
    if(!appSettings.baseCurrency)
    {
      return APIResponse.getAPIResponse(false, null, '011');
    }
    // Get list of active currencies
    const currencies = await CurrencyRepo.getActiveCurrencies();
    // Create promises array to get all rates based on base currency
    let promises = currencies.map( (currency) => {
      return new Promise( (resolve, reject) => {
        currencyConversion(currency.currencyCode, appSettings.baseCurrency,
          appSettings.currencyConversionAPIKey, function(err, amt){
            if(err) {
              reject(err);
            } else {
              currency.currencyRateAgainstBase = amt;
              resolve(currency);
            }
        });
      });
    });
    // Wait for rates and update database
    await Promise.all(promises).then( (data) => {
      return data.map( async currency => await currency.save());
    });
    return APIResponse.getAPIResponse(true, null, '023');
  }
}

module.exports = Currency;
