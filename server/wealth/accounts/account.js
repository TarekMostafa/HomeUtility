const AccountModel = require('./accountModel');

class Account {
  async getAccountsForDropDown() {
    return await AccountModel.findAll({
      attributes: ['accountId', 'accountNumber']
    });
  }

  async getAccounts() {
    return await AccountModel.findAll({});
  }
}

module.exports = Account;
