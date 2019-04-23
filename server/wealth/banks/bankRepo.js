const BankModel = require('./bankModel');

class BankRepo {
  static async getBank(id) {
    return await BankModel.findByPk(id);
  }

  static async getBanks() {
    return await BankModel.findAll({});
  }

  static async addBank(bank) {
    await BankModel.build(bank).save();
  }
}

module.exports = BankRepo;
