const AccountModel = require('./accountModel');
const Common = require('../../utilities/common');
const APIResponse = require('../../utilities/apiResponse');
const BankModel = require('../banks/bankModel');
const CurrencyModel = require('../../currencies/CurrencyModel');

class Account {
  async getAccountsForDropDown() {
    const accounts = await AccountModel.findAll({
      attributes: ['accountId', 'accountNumber']
    });
    return APIResponse.getAPIResponse(true, accounts);
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
    const accounts = await AccountModel.findAll({
      include: [
        { model: BankModel, as: 'bank', attributes: ['bankName'] },
        { model: CurrencyModel, as: 'currency', attributes: ['currencyRateAgainstBase'] }
      ],
      where: whereQuery
    });
    return APIResponse.getAPIResponse(true, accounts);
  }

  async getAccountStatuses() {
    const accountStatuses = ['ACTIVE', 'CLOSED'];
    return APIResponse.getAPIResponse(true, accountStatuses);
  }
}

module.exports = Account;
