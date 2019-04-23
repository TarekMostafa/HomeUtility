const CurrencyModel = require('./currencyModel');

class CurrencyRepo {
  static async getCurrencies(whereQuery) {
    return await CurrencyModel.findAll({ where : whereQuery});
  }

  static async getActiveCurrencies() {
    return await this.getCurrencies({currencyActive:true});
  }

  static async getCurrency(id) {
    return await CurrencyModel.findByPk(id);
  }

  static async addCurrency(currency) {
    CurrencyModel.build(currency).save();
  }
}

module.exports = CurrencyRepo;
