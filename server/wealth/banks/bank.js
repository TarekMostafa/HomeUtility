const BankModel = require('./bankModel');

class Bank {
  async getBanks() {
    return await BankModel.findAll({});
  }
}

module.exports = Bank;
