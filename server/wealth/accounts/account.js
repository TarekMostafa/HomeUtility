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
        { model: CurrencyModel, as: 'currency', attributes: ['currencyRateAgainstBase', 'currencyDecimalPlace'] }
      ],
      where: whereQuery
    });
    return APIResponse.getAPIResponse(true, accounts);
  }

  async getAccountStatuses() {
    const accountStatuses = ['ACTIVE', 'CLOSED'];
    return APIResponse.getAPIResponse(true, accountStatuses);
  }

  async addNewAccount(account) {
    account.accountCurrentBalance = account.accountStartBalance;
    account.accountStatus = 'ACTIVE';
    console.log(account);
    await AccountModel.build(account).save();
    return APIResponse.getAPIResponse(true, null, '025');
  }

  async getAccount(id) {
    const account = await AccountModel.findByPk(id);
    return APIResponse.getAPIResponse(true, account);
  }

  async editAccount(id, account) {
    const _account = await AccountModel.findByPk(id);
    if(_account === null) {
      return APIResponse.getAPIResponse(false, null, '026');
    }
    _account.accountNumber = account.accountNumber;
    // CurrentBalance = PreviousCurrentBalance - PreviousStartBalance + StartBalance
    _account.accountCurrentBalance = _account.accountCurrentBalance -
            _account.accountStartBalance + eval(account.accountStartBalance);
    _account.accountStartBalance = account.accountStartBalance;
    // Don't close account with current balance
    if(account.accountStatus === 'CLOSED'  && _account.accountCurrentBalance !== 0) {
      return APIResponse.getAPIResponse(false, null, '029');
    }
    _account.accountStatus = account.accountStatus;
    await _account.save();
    return APIResponse.getAPIResponse(true, null, '027');
  }

  async deleteAccount(id)  {
    const _account = await AccountModel.findByPk(id);
    if(_account === null) {
      return APIResponse.getAPIResponse(false, null, '026');
    }
    await _account.destroy();
    return APIResponse.getAPIResponse(true, null, '028');
  }
}

module.exports = Account;
