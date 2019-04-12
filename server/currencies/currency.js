const CurrencyCodes = require('currency-codes');

const CurrencyModel = require('./currencyModel');
const Common = require('../common/common');

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
    currency.currencyActive = 'NO';
    await currency.save();
    return Common.getAPIResponse(true, 'This currency has been successfully deactivated');
  }
}

module.exports = Currency;
