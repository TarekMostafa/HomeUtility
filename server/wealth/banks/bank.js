const BankModel = require('./bankModel');
const Common = require('../../common/common');

class Bank {
  async getBanks() {
    return await BankModel.findAll({});
  }

  async getBank(id) {
    return await BankModel.findByPk(id);
  }

  async addBank(bank) {
    const _bank = await this.getBank(bank.bankCode);
    if(_bank !== null) {
      return Common.getAPIResponse(false, 'This bank code already exists in the database');
    }
    await BankModel.build(bank).save();
    return Common.getAPIResponse(true, 'This bank has been successfully saved');
  }
}

module.exports = Bank;
