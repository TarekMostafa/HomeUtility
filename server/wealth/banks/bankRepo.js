const BankModel = require('./bankModel');

class BankRepo {
  static async getBank(id) {
    return await BankModel.findByPk(id);
  }

  static async getBanks() {
    return await BankModel.findAll({});
  }

  static async addBank(bank) {
    return await BankModel.build(bank).save();
  }

  static async saveBank(bank) {
    return await bank.save();
  }

  static async deleteBank(bank) {
    return await bank.destroy();
  }
}

module.exports = BankRepo;
