const BankRepo = require('./bankRepo');
const Exception = require('../../features/exception');
const AddBankRequest = require('./Request/addBankRequest');
const UpdateBankRequest = require('./Request/updateBankRequest');

class BankBusiness {
  async getBanks() {
    return await BankRepo.getBanks();
  }

  async addBank(newBank) {
    const bankRequest = new AddBankRequest(newBank);
    const bankModel = await BankRepo.getBank(bankRequest.bankCode);
    if(bankModel) {
      throw new Exception('BNK_EXIST');
    }
    const addedBank = await BankRepo.addBank(bankRequest);
    return addedBank;
  }

  async updateBank(id, editBank) {
    const bankRequest = new UpdateBankRequest(editBank);
    const bankModel = await BankRepo.getBank(id);
    if(!bankModel) {
      throw new Exception('BNK_NOTEXIST');
    }
    bankModel.bankName = bankRequest.bankName;
    const editedBank = await BankRepo.saveBank(bankModel);
    return editedBank;
  }

  async deleteBank(id) {
    const bankModel = await BankRepo.getBank(id);
    if(!bankModel) {
      throw new Exception('BNK_NOTEXIST');
    }
    await BankRepo.deleteBank(bankModel);
    return true;
  }
}

module.exports = BankBusiness;
