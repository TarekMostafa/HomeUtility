const AppParametersRepo = require('../appSettings/appParametersRepo');
const AppParametersConstants = require('../appSettings/appParametersConstants');
const CurrencyRepo = require('../currencies/currencyRepo');
const Exception = require('../features/exception');

let baseCurrency = null
let baseCurrencyObj = null;

module.exports.getBaseCurrency = async () => {
    
    if(!baseCurrency) {
        baseCurrency = await AppParametersRepo.getAppParameterValue(
            AppParametersConstants.BASE_CURRENCY);
        if(!baseCurrency) throw new Exception('APP_PARAM_ERROR');
    }
    
    if(!baseCurrencyObj) {
        baseCurrencyObj = await CurrencyRepo.getCurrency(baseCurrency);
        if(!baseCurrencyObj) throw new Exception('CURR_INV_BASE');
    }

    return baseCurrencyObj;
}

module.exports.updateBaseCurrency = async () => {
    baseCurrency = await AppParametersRepo.getAppParameterValue(
        AppParametersConstants.BASE_CURRENCY);
    if(!baseCurrency) throw new Exception('APP_PARAM_ERROR');
    baseCurrencyObj = await CurrencyRepo.getCurrency(baseCurrency);
    if(!baseCurrencyObj) throw new Exception('CURR_INV_BASE');
}