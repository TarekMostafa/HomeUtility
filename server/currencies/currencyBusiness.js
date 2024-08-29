const CurrencyCodes = require('currency-codes');

const CurrencyRepo = require('./currencyRepo');
//const AppSettingsRepo = require('../appSettings/appSettingsRepo');
const AppParametersRepo = require('../appSettings/appParametersRepo');
const AppParametersConstants = require('../appSettings/appParametersConstants');
//const APIResponse = require('../utilities/apiResponse');
const currencyConversion = require('./currencyConversion');
const Exception = require('../features/exception');

class Currency {

  async getCurrencies({active}) {
    // Construct Where Condition
    let whereQuery = {};
    // Check active property
    if(active) {
      whereQuery.currencyActive = active;
    }
    let currencies = await CurrencyRepo.getCurrencies(whereQuery);
    currencies = currencies.map( currency => {
      return {
        currencyCode: currency.currencyCode,
        currencyName: currency.currencyName,
        currencyActive: currency.currencyActive,
        currencyRateAgainstBase: currency.currencyRateAgainstBase,
        currencyDecimalPlace: currency.currencyDecimalPlace,
        currencyManualRateAgainstBase: currency.currencyManualRateAgainstBase
      }
    });
    return currencies;
  }

  async getCurrencyInfoFromThirdParty({code}){
    const currency = await CurrencyCodes.code(code);
    if(currency) {
      /*example of the returned data
      {
        code: 'SEK',
        number: '752',
        digits: 2,
        currency: 'Swedish Krona',
        countries: [ 'Sweden' ]
      }
      */
      return {
        code: currency.code,
        digits: currency.digits,
        currency: currency.currency
      };
    } else {
      throw new Exception('CURR_INVALID');
    }
  }

  async addCurrency({currencyCode, currencyName, currencyDecimalPlace}){
    const _currency = await CurrencyRepo.getCurrency(currencyCode);
    if(_currency) {
      throw new Exception('CURR_EXIST');
    }
    const currency = {
      currencyCode,
      currencyName,
      currencyActive: 'YES',
      currencyRateAgainstBase: 1,
      currencyDecimalPlace,
      currencyManualRateAgainstBase: 1,
    };
    await CurrencyRepo.addCurrency(currency);
  }

  async updateCurrency({code, manualRate, baseCurrency}) {
    //const baseCurrencyCode = await AppParametersRepo.getAppParameterValue(AppParametersConstants.BASE_CURRENCY);
    //if(!baseCurrencyCode){
    if(!baseCurrency) {
      throw new Exception('CURR_INV_BASE');
    }

    let currency = await CurrencyRepo.getCurrency(code);
    if(!currency) {
      throw new Exception('CURR_NOT_EXIST', code);
    }

    // if(baseCurrencyCode === currency.currencyCode && manualRate != 1){
    if(baseCurrency.currencyCode === currency.currencyCode && manualRate != 1){
      throw new Exception('CURR_INV_MANUAL_RATE');
    }

    currency.currencyManualRateAgainstBase = manualRate;
    await CurrencyRepo.saveCurrency(currency);
  }

  async activateCurrency({code}) {
    let currency = await CurrencyRepo.getCurrency(code);
    if(!currency) {
      throw new Exception('CURR_NOT_EXIST', code);
    }
    currency.currencyActive = 'YES';
    await currency.save();
  }

  async deactivateCurrency({code, baseCurrency}) {
    let currency = await CurrencyRepo.getCurrency(code);
    if(!currency) {
      throw new Exception('CURR_NOT_EXIST', code);
    }
    // Get Base Currency
    //const appSettings = await AppSettingsRepo.getAppSettings();
    //const baseCurrencyCode = await AppParametersRepo.getAppParameterValue(AppParametersConstants.BASE_CURRENCY);
    //if(baseCurrencyCode /*appSettings.baseCurrency*/)
    if(baseCurrency)
    {
      //Check base currency with the passed one
      //if(/*appSettings.baseCurrency*/baseCurrencyCode === currency.currencyCode) {
      if(baseCurrency.currencyCode === currency.currencyCode) {
        throw new Exception('CURR_DEACT_BASE', code);
      }
    }
    currency.currencyActive = 'NO';
    currency.currencyRateAgainstBase = 1;
    await currency.save();
  }

  async updateRates({baseCurrency}) {
    // Get Base Currency
    //const appSettings = await AppSettingsRepo.getAppSettings();
    //const baseCurrencyCode = await AppParametersRepo.getAppParameterValue(AppParametersConstants.BASE_CURRENCY);
    //if(/*!appSettings.baseCurrency*/!baseCurrencyCode){
    if(!baseCurrency) {
      throw new Exception('CURR_INV_BASE');
    }
    // const baseCurrency = await CurrencyRepo.getCurrency(baseCurrencyCode);
    // if(!baseCurrency){
    //   throw new Exception('CURR_INV_BASE');
    // }
    //Get API Key
    const apiKey = await AppParametersRepo.getAppParameterValue(AppParametersConstants.CURRENCY_CONVERSION_API_KEY);
    if(!apiKey) {
      throw new Exception('INV_API_KEY');
    }
    // Get list of active currencies
    let currencies = await CurrencyRepo.getActiveCurrencies();
    //process all active currencies
    currencies = await Promise.all(currencies.map(async currency => {
      let rate = 1;
      if(currency.currencyCode!==baseCurrency.currencyCode)
        rate = await currencyConversion(currency.currencyCode, baseCurrency.currencyCode, apiKey);
      currency.currencyRateAgainstBase = rate;
      await currency.save();
    }));
  }
}

module.exports = Currency;
