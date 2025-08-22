const BankRepo = require('./bankRepo');
const Exception = require('../../features/exception');
const AddBankRequest = require('./request/addBankRequest');
const UpdateBankRequest = require('./request/updateBankRequest');

class BankBusiness {
  async getBanks() {
    let banks = await BankRepo.getBanks();
    banks = banks.map( bank => {
      return {
        bankCode: bank.bankCode,
        bankName: bank.bankName,
        bankStatus: bank.bankStatus,
      }
    });
    return banks;
  }

  async addBank(newBank) {
    const bankRequest = new AddBankRequest(newBank);
    const bankModel = await BankRepo.getBank(bankRequest.bankCode);
    if(bankModel) {
      throw new Exception('BANK_EXIST');
    }
    await BankRepo.addBank(bankRequest);
  }

  async updateBank(id, editBank) {
    const bankRequest = new UpdateBankRequest(editBank);
    const bankModel = await BankRepo.getBank(id);
    if(!bankModel) {
      throw new Exception('BANK_NOT_EXIST');
    }
    bankModel.bankName = bankRequest.bankName;
    await BankRepo.saveBank(bankModel);
  }

  async deleteBank(id) {
    const bankModel = await BankRepo.getBank(id);
    if(!bankModel) {
      throw new Exception('BANK_NOT_EXIST');
    }
    await BankRepo.deleteBank(bankModel);
  }
}

module.exports = BankBusiness;
