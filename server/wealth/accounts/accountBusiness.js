const Sequelize = require('sequelize');
const sequelize = require('../../db/dbConnection').getSequelize();
const AccountRepo = require('./accountRepo');
const AppParametersRepo = require('../../appSettings/appParametersRepo');
const AppParametersConstants = require('../../appSettings/appParametersConstants');
const Exception = require('../../features/exception');
const AmountHelper = require('../../helper/AmountHelper');

const Op = Sequelize.Op;

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

  async getAccounts({banks, statuses, currencies},{baseCurrency}) {
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
    if(banks) {
      //whereQuery.accountBankCode = banks;
      whereQuery.accountBankCode = {
        [Op.in]: banks
      }
    }
    // Status
    if(statuses) {
      //whereQuery.accountStatus = status;
      whereQuery.accountStatus = {
        [Op.in]: statuses
      }
    }
    // Currency
    if(currencies) {
      //whereQuery.accountCurrency = currency;
      whereQuery.accountCurrency = {
        [Op.in]: currencies
      }
    }
    
    let accounts = await AccountRepo.getAccounts(whereQuery);
    accounts = accounts.map( account => {

      const currencyRateAgainstBase = (isAutomatic? account.currency.currencyRateAgainstBase
        :account.currency.currencyManualRateAgainstBase);

      return {
        accountId: account.accountId,
        accountNumber: account.accountNumber,
        accountCurrentBalance: account.accountCurrentBalance,
        accountCurrentBalanceFormatted: AmountHelper.formatAmount(account.accountCurrentBalance,
          account.currency.currencyDecimalPlace),
        accountLastBalanceUpdate: account.accountLastBalanceUpdate,
        accountStartBalance: account.accountStartBalance,
        accountStartBalanceFormatted: AmountHelper.formatAmount(account.accountStartBalance,
          account.currency.currencyDecimalPlace),
        accountEquivalentBalance: account.accountCurrentBalance *  currencyRateAgainstBase,
        accountEquivalentBalanceFormatted: AmountHelper.formatAmount(
          (account.accountCurrentBalance *  currencyRateAgainstBase), baseCurrency.currencyDecimalPlace),
        accountStatus: account.accountStatus,
        accountCurrency: account.accountCurrency,
        accountBankCode: account.accountBankCode,
        bankName: account.bank.bankName,
        currencyDecimalPlace: account.currency.currencyDecimalPlace,
        currencyRateAgainstBase,
      }
    });

    const totalCurrentBalance = accounts.reduce( 
      (acc, obj) => Number(acc)+Number(obj.accountCurrentBalance * obj.currencyRateAgainstBase), 0);

    return {
      accounts,
      totalCurrentBalance,
      totalCurrentBalanceFormatted: AmountHelper.formatAmount(totalCurrentBalance, 
        baseCurrency.currencyDecimalPlace),
      baseCurrencyCode: baseCurrency.currencyCode
    };
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

  async addNewAccount({accountNumber, accountStartBalance, accountBankCode, accountCurrency, 
    user, baseCurrency}) {
    //const baseCurrencyCode = await AppParametersRepo.getAppParameterValue(AppParametersConstants.BASE_CURRENCY);
    //if(!baseCurrencyCode) {
    if(!baseCurrency) {
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
      accountCurrentBalanceFormatted: AmountHelper.formatAmount(account.accountCurrentBalance,
        account.currency.currencyDecimalPlace),
      accountLastBalanceUpdate: account.accountLastBalanceUpdate,
      accountStartBalance: account.accountStartBalance,
      accountStartBalanceFormatted: AmountHelper.formatAmount(account.accountStartBalance,
        account.currency.currencyDecimalPlace),
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
