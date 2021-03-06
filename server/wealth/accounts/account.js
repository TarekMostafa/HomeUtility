const sequelize = require('../../db/dbConnection').getSequelize();
const AccountRepo = require('./accountRepo');
const AppSettingsRepo = require('../../appSettings/appSettingsRepo');
const APIResponse = require('../../utilities/apiResponse');

class Account {
  async getAccountsForDropDown() {
    const accounts = await AccountRepo.getSimpleAccounts();
    return APIResponse.getAPIResponse(true, accounts);
  }

  async getAccounts({bank, status, currency}) {
    // Construct Where Condition
    let whereQuery = {};
    // Bank Code
    if(bank) {
      whereQuery.accountBankCode = bank;
    }
    // Status
    if(status) {
      whereQuery.accountStatus = status;
    }
    // Currency
    if(currency) {
      whereQuery.accountCurrency = currency;
    }
    const accounts = await AccountRepo.getAccounts(whereQuery);
    return APIResponse.getAPIResponse(true, accounts);
  }

  async getAccountStatuses() {
    const accountStatuses = ['ACTIVE', 'CLOSED'];
    return APIResponse.getAPIResponse(true, accountStatuses);
  }

  async addNewAccount(account) {
    const appSettings = await AppSettingsRepo.getAppSettings();
    if(!appSettings || !appSettings.baseCurrency)
    {
      return APIResponse.getAPIResponse(false, null, '039');
    }
    account.accountCurrentBalance = account.accountStartBalance;
    account.accountStatus = 'ACTIVE';
    account.accountUser = account.user.userId;
    await AccountRepo.addAccount(account);
    return APIResponse.getAPIResponse(true, null, '025');
  }

  async getAccount(id) {
    const account = await AccountRepo.getAccount(id);
    return APIResponse.getAPIResponse(true, account);
  }

  async editAccount(id, account) {
    const _account = await AccountRepo.getAccount(id);
    if(_account === null) {
      return APIResponse.getAPIResponse(false, null, '026');
    }
    // Don't close account with current balance
    if(account.accountStatus === 'CLOSED'  && _account.accountCurrentBalance != 0) {
      return APIResponse.getAPIResponse(false, null, '029');
    }
    await _account.update({
      accountNumber: account.accountNumber,
      accountStartBalance: account.accountStartBalance,
      accountStatus: account.accountStatus,
      accountCurrentBalance: sequelize.literal('accountCurrentBalance-'+ _account.accountStartBalance+'+'
        +account.accountStartBalance)
    });
    return APIResponse.getAPIResponse(true, null, '027');
  }

  async deleteAccount(id)  {
    const _account = await AccountRepo.getAccount(id);
    if(_account === null) {
      return APIResponse.getAPIResponse(false, null, '026');
    }
    await _account.destroy();
    return APIResponse.getAPIResponse(true, null, '028');
  }
}

module.exports = Account;
