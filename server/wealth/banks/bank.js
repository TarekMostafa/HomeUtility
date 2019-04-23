const BankRepo = require('./bankRepo');
const APIResponse = require('../../utilities/apiResponse');

class Bank {
  async getBanks() {
    const banks = await BankRepo.getBanks();
    return APIResponse.getAPIResponse(true, banks);
  }

  async addBank(bank) {
    const _bank = await BankRepo.getBank(bank.bankCode);
    if(_bank) {
      return APIResponse.getAPIResponse(false, null, '012');
    }
    await BankRepo.addBank(bank);
    return APIResponse.getAPIResponse(true, null, '013');
  }

  async updateBank(id, bank) {
    const _bank = await BankRepo.getBank(id);
    if(!_bank) {
      return APIResponse.getAPIResponse(false, null, '014');
    }
    _bank.bankName = bank.bankName;
    await _bank.save();
    return APIResponse.getAPIResponse(true, null, '015');
  }

  async deleteBank(id) {
    const _bank = await BankRepo.getBank(id);
    if(!_bank) {
      return APIResponse.getAPIResponse(false, null, '014');
    }
    await _bank.destroy();
    return APIResponse.getAPIResponse(true, null, '016');
  }
}

module.exports = Bank;
