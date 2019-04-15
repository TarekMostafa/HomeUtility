const BankModel = require('./bankModel');
const APIResponse = require('../../utilities/apiResponse');

class Bank {
  async getBanks() {
    const banks = await BankModel.findAll({});
    return APIResponse.getAPIResponse(true, banks);
  }

  async getBank(id) {
    return await BankModel.findByPk(id);
  }

  async addBank(bank) {
    const _bank = await this.getBank(bank.bankCode);
    if(_bank !== null) {
      return APIResponse.getAPIResponse(false, null, '012');
    }
    await BankModel.build(bank).save();
    return APIResponse.getAPIResponse(true, null, '013');
  }

  async updateBank(id, bank) {
    const _bank = await this.getBank(id);
    if(_bank === null) {
      return APIResponse.getAPIResponse(false, null, '014');
    }
    _bank.bankName = bank.bankName;
    await _bank.save();
    return APIResponse.getAPIResponse(true, null, '015');
  }

  async deleteBank(id) {
    const _bank = await this.getBank(id);
    if(_bank === null) {
      return APIResponse.getAPIResponse(false, null, '014');
    }
    await _bank.destroy();
    return APIResponse.getAPIResponse(true, null, '016');
  }
}

module.exports = Bank;
