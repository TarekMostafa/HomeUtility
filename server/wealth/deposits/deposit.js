const sequelize = require('../../db/dbConnection').getSequelize();
const DepositRepo = require('./depositRepo');
const AccountRepo = require('../accounts/accountRepo');
const TransactionRepo = require('../transactions/transactionRepo');
const APIResponse = require('../../utilities/apiResponse');
const Transaction = require('../transactions/transaction');
const RelatedTransactionRepo = require('../relatedTransactions/relatedTransactionRepo');

class Deposit {
  async getDeposits({bank, status, currency}) {
    // Construct Where Condition
    let whereQuery = {};
    // Bank Code
    if(bank) {
      whereQuery.bankCode = bank;
    }
    // Status
    if(status) {
      whereQuery.status = status;
    }
    // Currency
    if(currency) {
      whereQuery.currencyCode = currency;
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
      //Add Related transaction
      const relatedTransaction = await RelatedTransactionRepo.
        addRelatedTransaction({
          relatedTransactionType: 'DEP',
          relatedTransactionDesc: ''
        }, dbTransaction);
      let relatedId = relatedTransaction.relatedTransactionsId;
      //Add New Deposit
      deposit.relatedId = relatedId;
      let savedDeposit = await DepositRepo.addDeposit(deposit, dbTransaction);
      const transaction = new Transaction();
      //Add Deposit Transaction
      const result = await transaction.addTransaction({
          transactionAmount: deposit.amount,
          transactionNarrative: 'Add Deposit (' + deposit.reference + ')',
          transactionPostingDate: deposit.startDate,
          transactionCRDR: 'Debit',
          transactionAccount: deposit.accountId,
          transactionTypeId: deposit.transDebitType,
          transactionModule: 'DEP',
          transactionRelatedTransactionId: relatedId,
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

  async addDepositInterest(id, tempTransaction) {
    const _deposit = await DepositRepo.getDeposit(id);
    if(_deposit === null) {
      return APIResponse.getAPIResponse(false, null, '049');
    }
    //Start SQL transaction
    let dbTransaction;
    try {
      dbTransaction = await sequelize.transaction();
      //Add Deposit Transaction
      const transaction = new Transaction();
      const result = await transaction.addTransaction({
          transactionAmount: tempTransaction.amount,
          transactionNarrative: 'Deposit Interest (' + _deposit.reference + ')',
          transactionPostingDate: tempTransaction.date,
          transactionCRDR: 'Credit',
          transactionAccount: _deposit.accountId,
          transactionTypeId: _deposit.interestTransType,
          transactionRelatedTransactionId: _deposit.relatedId,
        }, dbTransaction);
      if(!result.success) {
        await dbTransaction.rollback();
        return APIResponse.getAPIResponse(false, null, '053');
      }
      await dbTransaction.commit();
      return APIResponse.getAPIResponse(true, null, '054');
    } catch (err) {
      await dbTransaction.rollback();
      return APIResponse.getAPIResponse(false, null, '053');
    }
  }

  async releaseDeposit(id, releaseData) {
    const _deposit = await DepositRepo.getDeposit(id);
    if(_deposit === null) {
      return APIResponse.getAPIResponse(false, null, '049');
    }
    //Start SQL transaction
    let dbTransaction;
    try {
      dbTransaction = await sequelize.transaction();
      //Add Deposit Transaction
      const transaction = new Transaction();
      const result = await transaction.addTransaction({
          transactionAmount: _deposit.amount,
          transactionNarrative: 'Release Deposit (' + _deposit.reference + ')',
          transactionPostingDate: releaseData.releaseDate,
          transactionCRDR: 'Credit',
          transactionAccount: _deposit.accountId,
          transactionTypeId: releaseData.transCreditType,
          transactionModule: 'DEP',
          transactionRelatedTransactionId: _deposit.relatedId,
        }, dbTransaction);
      if(!result.success) {
        await dbTransaction.rollback();
        return APIResponse.getAPIResponse(false, null, '055');
      }
      //Save Deposit related Id
      _deposit.releaseDate = releaseData.releaseDate;
      _deposit.releaseTransId = result.payload.transactionId;
      _deposit.status = 'CLOSED';
      await _deposit.save({transaction: dbTransaction});
      await dbTransaction.commit();
      return APIResponse.getAPIResponse(true, null, '056');
    } catch (err) {
      console.log(err);
      await dbTransaction.rollback();
      return APIResponse.getAPIResponse(false, null, '055');
    }
  }
}

module.exports = Deposit;
