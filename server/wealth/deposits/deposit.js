const sequelize = require('../../db/dbConnection').getSequelize();
const DepositRepo = require('./depositRepo');
const AppSettingsRepo = require('../../appSettings/appSettingsRepo');
const AccountRepo = require('../accounts/accountRepo');
const TransactionRepo = require('../transactions/transactionRepo');
const Common = require('../../utilities/common');
const APIResponse = require('../../utilities/apiResponse');
const Transaction = require('../transactions/transaction');

class Deposit {
  async getDeposits({bank, status}) {
    // Construct Where Condition
    let whereQuery = {};
    // Bank Code
    if(Common.getText(bank, '') !== '') {
      whereQuery.bankCode = bank;
    }
    // Status
    if(Common.getText(status, '') !== '') {
      whereQuery.status = status;
    }
    const deposits = await DepositRepo.getDeposits(whereQuery);
    return APIResponse.getAPIResponse(true, deposits);
  }

  async getDeposit(id) {
    const deposit = await DepositRepo.getDeposit(id);
    return APIResponse.getAPIResponse(true, deposit);
  }

  async addNewDeposit(deposit) {
    //Check deposit account
    const account = await AccountRepo.getAccount(deposit.accountId);
    if(!account) {
      return APIResponse.getAPIResponse(false, null, '032');
    }
    deposit.status = 'ACTIVE';
    deposit.bankCode = account.accountBankCode;
    deposit.currencyCode = account.accountCurrency;
    //Start SQL transaction
    let dbTransaction;
    try {
      dbTransaction = await sequelize.transaction();
      //Add New Deposit
      let savedDeposit = await DepositRepo.addDeposit(deposit, dbTransaction);
      const transaction = new Transaction();
      //Add Deposit Transaction
      const result = await transaction.addTransaction({
          transactionAmount: deposit.amount,
          transactionNarrative: 'Add Deposit ' + deposit.reference,
          transactionPostingDate: deposit.startDate,
          transactionCRDR: 'Debit',
          transactionAccount: deposit.accountId,
          transactionTypeId: deposit.transDebitType,
        }, dbTransaction);
      if(!result.success) {
        await dbTransaction.rollback();
        return APIResponse.getAPIResponse(false, null, '048');
      }
      //Save Deposit Original Transaction Id
      savedDeposit.originalTransId = result.payload.transactionId;
      await savedDeposit.save({transaction: dbTransaction});
      await dbTransaction.commit();
      return APIResponse.getAPIResponse(true, null, '047');
    } catch (err) {
      console.log(err);
      await dbTransaction.rollback();
      return APIResponse.getAPIResponse(false, null, '048');
    }
  }

  async deleteDeposit(id) {
    const _deposit = await DepositRepo.getDeposit(id);
    if(_deposit === null) {
      return APIResponse.getAPIResponse(false, null, '049');
    }
    if(_deposit.relatedId) {
      return APIResponse.getAPIResponse(false, null, '052');
    }
    const _originalTrans = await TransactionRepo.getTransaction(_deposit.originalTransId);
    if(_originalTrans === null) {
      return APIResponse.getAPIResponse(false, null, '034');
    }
    //Start SQL transaction
    let dbTransaction;
    try {
      dbTransaction = await sequelize.transaction();
      await _deposit.destroy({transaction: dbTransaction});
      const transaction = new Transaction();
      await transaction.deleteTransaction(_originalTrans.transactionId, dbTransaction);
      await dbTransaction.commit();
      return APIResponse.getAPIResponse(true, null, '050');
    } catch (err) {
      console.log(err);
      await dbTransaction.rollback();
      return APIResponse.getAPIResponse(false, null, '051');
    }
  }
}

module.exports = Deposit;
