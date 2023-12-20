const sequelize = require('../../db/dbConnection').getSequelize();
const AccountRepo = require('./accountRepo');
//const AppSettingsRepo = require('../../appSettings/appSettingsRepo');
const AppParametersRepo = require('../../appSettings/appParametersRepo');
const AppParametersConstants = require('../../appSettings/appParametersConstants');
//const APIResponse = require('../../utilities/apiResponse');
const Exception = require('../../features/exception');

class Account {
  async getAccountsForDropDown() {
    let accounts = await AccountRepo.getSimpleAccounts();
    accounts = accounts.map( account => {
      return {
        accountId: account.accountId,
        accountNumber: account.accountNumber,
        accountStatus: account.accountStatus,
        accountCurrency: account.accountCurrency,
        accountBankCode: account.accountBankCode,
        bankName: account.bank.bankName,
        currencyDecimalPlace: account.currency.currencyDecimalPlace
      }
    });
    return accounts;
  }

  async getAccounts({bank, status, currency}) {
    //Get param value
    let isAutomatic = true;
    const automaticOrManual = await AppParametersRepo.getAppParameterValue(
      AppParametersConstants.AUTOMATIC_OR_MANUAL_RATE);
    if(automaticOrManual) {
      isAutomatic = (automaticOrManual === AppParametersConstants.AUTOMATIC ||
        automaticOrManual !== AppParametersConstants.MANUAL);
    }

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
    
    let accounts = await AccountRepo.getAccounts(whereQuery);
    accounts = accounts.map( account => {
      return {
        accountId: account.accountId,
        accountNumber: account.accountNumber,
        accountCurrentBalance: account.accountCurrentBalance,
        accountLastBalanceUpdate: account.accountLastBalanceUpdate,
        accountStartBalance: account.accountStartBalance,
        accountStatus: account.accountStatus,
        accountCurrency: account.accountCurrency,
        accountBankCode: account.accountBankCode,
        bankName: account.bank.bankName,
        currencyDecimalPlace: account.currency.currencyDecimalPlace,
        currencyRateAgainstBase: (isAutomatic? account.currency.currencyRateAgainstBase
          :account.currency.currencyManualRateAgainstBase),
      }
    });
    return accounts;
  }

  async getAccountStatuses() {
    const accountStatuses = ['ACTIVE', 'CLOSED'];
    return accountStatuses;
  }

  // async addNewAccount(account) {
  //   const appSettings = await AppSettingsRepo.getAppSettings();
  //   if(!appSettings || !appSettings.baseCurrency)
  //   {
  //     return APIResponse.getAPIResponse(false, null, '039');
  //   }
  //   account.accountCurrentBalance = account.accountStartBalance;
  //   account.accountStatus = 'ACTIVE';
  //   account.accountUser = account.user.userId;
  //   await AccountRepo.addAccount(account);
  //   return APIResponse.getAPIResponse(true, null, '025');
  // }

  async addNewAccount({accountNumber, accountStartBalance, accountBankCode, accountCurrency, user}) {
    const baseCurrencyCode = await AppParametersRepo.getAppParameterValue(AppParametersConstants.BASE_CURRENCY);
    if(!baseCurrencyCode) {
      throw new Exception('CURR_INV_BASE');
    }

    const account = {
      accountNumber,
      accountStartBalance,
      accountBankCode,
      accountCurrency,
      accountCurrentBalance: accountStartBalance,
      accountStatus: 'ACTIVE',
      accountUser: user.userId
    }
    await AccountRepo.addAccount(account);
  }

  async getAccount(id) {
    let account = await AccountRepo.getAccount(id);
    account = {
      accountId: account.accountId,
      accountNumber: account.accountNumber,
      accountCurrentBalance: account.accountCurrentBalance,
      accountLastBalanceUpdate: account.accountLastBalanceUpdate,
      accountStartBalance: account.accountStartBalance,
      accountStatus: account.accountStatus,
      accountCurrency: account.accountCurrency,
      accountBankCode: account.accountBankCode,
      bankName: account.bank.bankName,
      currencyDecimalPlace: account.currency.currencyDecimalPlace,
    }
    return account;
  }

  async editAccount(id, {accountNumber, accountStartBalance, accountStatus}) {
    const account = await AccountRepo.getAccount(id);
    if(account === null) {
      throw new Exception('ACC_NOT_EXIST');
    }
    // Don't close account with current balance
    if(accountStatus === 'CLOSED'  && account.accountCurrentBalance != 0) {
      throw new Exception('ACC_NOT_CLOSE');
    }
    await account.update({
      accountNumber: accountNumber,
      accountStartBalance: accountStartBalance,
      accountStatus: accountStatus,
      accountCurrentBalance: sequelize.literal('accountCurrentBalance-'+ account.accountStartBalance+'+'
        +accountStartBalance)
    });
  }

  async deleteAccount(id)  {
    const _account = await AccountRepo.getAccount(id);
    if(_account === null) {
      throw new Exception('ACC_NOT_EXIST')
    }
    await _account.destroy();
  }
}

module.exports = Account;
