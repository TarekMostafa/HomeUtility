//const AppSettingsRepo = require('./appSettingsRepo');
const AppParametersRepo = require('./appParametersRepo');
//const CurrencyRepo = require('../currencies/currencyRepo');
//const APIResponse = require('../utilities/apiResponse');
const AppParametersConstants = require('../appSettings/appParametersConstants');
const Exception = require('../features/exception');
const BaseCurrency = require('../currencies/baseCurrency');

class AppSettings {

  async getAppSettings() {
    //const appSettings = await AppSettingsRepo.getAppSettingsWithCurrency();
    //if(appSettings) {
    //  return APIResponse.getAPIResponse(true, appSettings);
    //} else {
    //  return APIResponse.getAPIResponse(false, null, '001');
    //}
    // const appParameters = await AppParametersRepo.getParameters([AppParametersConstants.BASE_CURRENCY,AppParametersConstants.CURRENCY_CONVERSION_API_KEY]);
    // if(!appParameters) {
    //   return APIResponse.getAPIResponse(false, null, 'APP_PARAM_ERROR');
    // } else {
    //   const appSettings = appParameters.reduce((acc, param) => {
    //     Object.assign(acc, {[param.paramName] : param.paramValue});
    //     return acc;
    //   }, {}); 
    //   if(appSettings.hasOwnProperty(AppParametersConstants.BASE_CURRENCY)){
    //     const currency = await CurrencyRepo.getCurrency(appSettings.baseCurrency);
    //     if(currency){
    //       appSettings.currency = {
    //         "currencyDecimalPlace": currency.currencyDecimalPlace,
    //         "currencyRateAgainstBase": currency.currencyRateAgainstBase
    //       };
    //     }
    //   } 
    // }

    const baseCurrency = await BaseCurrency.getBaseCurrencyWithForce();
    const conversionParam = await AppParametersRepo.getParameter(
      AppParametersConstants.CURRENCY_CONVERSION_API_KEY);
    
    const appSettings = {
      baseCurrency: baseCurrency.currencyCode,
      currencyConversionAPIKey: conversionParam.paramValue,
      currency: {
        currencyDecimalPlace: baseCurrency.currencyDecimalPlace,
        currencyRateAgainstBase: baseCurrency.currencyRateAgainstBase
      }
    }
      
    //return APIResponse.getAPIResponse(true, appSettings);
    return appSettings;
  }

  async updateAppSettings({newBaseCurrency}) {
    //let appSettings = await AppSettingsRepo.getAppSettings();
    //if(!appSettings) {
    //  return APIResponse.getAPIResponse(false, null, '001');
    //}
    //appSettings.baseCurrency = baseCurrency;
    //await appSettings.save();
    //return APIResponse.getAPIResponse(true, null, '002');
    let appParameter = await AppParametersRepo.getParameter(AppParametersConstants.BASE_CURRENCY, true);
    if(!appParameter) {
      //return APIResponse.getAPIResponse(false, null, 'APP_PARAM_ERROR');
      throw new Exception('APP_PARAM_ERROR');
    }
    appParameter.paramValue = newBaseCurrency;
    await appParameter.save();
    //return APIResponse.getAPIResponse(true, null, 'APP_PARAM_UPDATE');
  }
}

module.exports = AppSettings;
