const CurrencyModel = require('./currencyModel');
const Common = require('../common/common');

class Currency {
  async getCurrencies({active}) {
    // Construct Where Condition
    let whereQuery = {};
    // active
    if(Common.getText(active, '') !== '') {
      whereQuery.currencyActive = active;
    }
    return await CurrencyModel.findAll({
      where: whereQuery
    });
  }

  async activateCurrency({code}) {
    let currency = await CurrencyModel.findByPk(code);
    if(currency === null) {
      return false;
    }
    currency.currencyActive = 'YES';
    return await currency.save();
  }

  async deactivateCurrency({code}) {
    let currency = await CurrencyModel.findByPk(code);
    if(currency === null) {
      return false;
    }
    currency.currencyActive = 'NO';
    return await currency.save();
  }
}

module.exports = Currency;
