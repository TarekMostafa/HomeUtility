const AccountModel = require('./accountModel');
const Common = require('../../common/common');
const BankModel = require('../banks/bankModel');

class Account {
  async getAccountsForDropDown() {
    return await AccountModel.findAll({
      attributes: ['accountId', 'accountNumber']
    });
  }

  async getAccounts({bank, status}) {
    // Construct Where Condition
    let whereQuery = {};
    // Bank Code
    if(Common.getText(bank, '') !== '') {
      whereQuery.accountBankCode = bank;
    }
    // Status
    if(Common.getText(status, '') !== '') {
      whereQuery.accountStatus = status;
    }
    return await AccountModel.findAll({
      include: [
        { model: BankModel, as: 'bank', attributes: ['bankName'] }
      ],
      where: whereQuery
    });
  }
}

module.exports = Account;
