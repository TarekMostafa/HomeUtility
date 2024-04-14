const sequelize = require('../../db/dbConnection').getSequelize();
const DepositRepo = require('./depositRepo');
const AccountRepo = require('../accounts/accountRepo');
const TransactionRepo = require('../transactions/transactionRepo');
//const APIResponse = require('../../utilities/apiResponse');
const TransactionBusiness = require('../transactions/transactionBusiness');
const RelatedTransactionRepo = require('../relatedTransactions/relatedTransactionRepo');
const Exception = require('../../features/exception');
const AppParametersRepo = require('../../appSettings/appParametersRepo');
const AppParametersConstants = require('../../appSettings/appParametersConstants');

class Deposit {
  async getDeposits({bank, status, currency}) {
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

    let deposits = await DepositRepo.getDeposits(whereQuery);
    deposits = deposits.map( deposit => {
      return {
        id: deposit.id,
        reference: deposit.reference,
        amount: deposit.amount,
        status: deposit.status,
        rate: deposit.rate,
        bankCode: deposit.bank.bankCode,
        bankName: deposit.bank.bankName,
        accountId: deposit.accountId,
        currencyCode: deposit.currencyCode,
        currencyRateAgainstBase: (isAutomatic? deposit.currency.currencyRateAgainstBase
          :deposit.currency.currencyManualRateAgainstBase),
        currencyDecimalPlace: deposit.currency.currencyDecimalPlace,
        startDate: deposit.startDate,
        endDate: deposit.endDate,
        releaseDate: deposit.releaseDate,
        originalTransId: deposit.originalTransId,
        relatedId: deposit.relatedId,
        interestTransType: deposit.interestTransType,
        releaseTransId: deposit.releaseTransId
      }
    });

    return deposits;
  }

  async getDeposit(id) {
    let deposit = await DepositRepo.getDeposit(id);
    deposit = {
      id: deposit.id,
      reference: deposit.reference,
      amount: deposit.amount,
      status: deposit.status,
      rate: deposit.rate,
      bankCode: deposit.bankCode,
      bankName: deposit.bank.bankName,
      accountId: deposit.accountId,
      accountNumber: deposit.account.accountNumber,
      currencyCode: deposit.currencyCode,
      currencyDecimalPlace: deposit.currency.currencyDecimalPlace,
      startDate: deposit.startDate,
      endDate: deposit.endDate,
      releaseDate: deposit.releaseDate,
      originalTransId: deposit.originalTransId,
      relatedId: deposit.relatedId,
      interestTransType: deposit.interestTransType,
      releaseTransId: deposit.releaseTransId
    }

    return deposit;
  }

  async addNewDeposit({
    reference, accountId, amount, rate, startDate,
    endDate, transDebitType, interestTransType
  }) {
    //Check deposit account
    const account = await AccountRepo.getAccount(accountId);
    if(!account) {
      throw new Exception('ACC_INVALID');
    }

    let deposit = {
      reference,
      accountId,
      amount,
      rate,
      startDate: Common.getDate(startDate, ''),
      endDate: Common.getDate(endDate, ''),
      interestTransType,
      status: 'ACTIVE',
      bankCode: account.accountBankCode,
      currencyCode: account.accountCurrency
    }
    //Start SQL transaction
    let dbTransaction;
    try {
      dbTransaction = await sequelize.transaction();
      //Add Related transaction
      const relatedTransaction = await RelatedTransactionRepo.
        addRelatedTransaction({
          relatedTransactionType: 'DEP',
          relatedTransactionDesc: this.getDescription(deposit.reference, deposit.amount,
            account.accountCurrency, deposit.startDate, deposit.endDate)
        }, dbTransaction);
      let relatedId = relatedTransaction.relatedTransactionsId;
      //Add New Deposit
      deposit.relatedId = relatedId;
      let savedDeposit = await DepositRepo.addDeposit(deposit, dbTransaction);
      const transactionBusiness = new TransactionBusiness();
      //Add Deposit Transaction
      const savedTrans = await transactionBusiness.addTransaction({
          transactionAmount: deposit.amount,
          transactionNarrative: 'Add Deposit (' + deposit.reference + ')',
          transactionPostingDate: deposit.startDate,
          transactionCRDR: 'Debit',
          transactionAccount: deposit.accountId,
          transactionTypeId: transDebitType,
          transactionModule: 'DEP',
          transactionRelatedTransactionId: relatedId,
        }, dbTransaction);
      if(!savedTrans) {
        await dbTransaction.rollback();
        throw new Exception('DEP_ADD_FAIL');
      }
      //Save Deposit Original Transaction Id
      savedDeposit.originalTransId = savedTrans.transactionId;
      await savedDeposit.save({transaction: dbTransaction});
      await dbTransaction.commit();
    } catch (err) {
      await dbTransaction.rollback();
      throw new Exception('DEP_ADD_FAIL');
    }
  }

  async deleteDeposit(id) {
    const _deposit = await DepositRepo.getDeposit(id);
    if(_deposit === null) {
      throw new Exception('DEP_NOT_EXIST');
    }
    const _originalTrans = await TransactionRepo.getTransaction(_deposit.originalTransId);
    if(_originalTrans === null) {
      throw new Exception('TRANS_NOT_EXIST');
    }
    const IsExist = await TransactionRepo.IsDepositTransactionExist(_deposit.relatedId, 
      _deposit.originalTransId)
    if(IsExist) {
      throw new Exception('DEP_REL_TRANS_ERR');
    }
    //Start SQL transaction
    let dbTransaction;
    try {
      dbTransaction = await sequelize.transaction();
      await _deposit.destroy({transaction: dbTransaction});
      const transactionBusiness = new TransactionBusiness();
      await transactionBusiness.deleteTransaction(_originalTrans.transactionId, dbTransaction);
      await dbTransaction.commit();
    } catch (err) {
      console.log(err);
      await dbTransaction.rollback();
      throw new Exception('DEP_DELETE_FAIL');
    }
  }

  async addDepositInterest(id, {amount, date}) {
    const _deposit = await DepositRepo.getDeposit(id);
    if(_deposit === null) {
      throw new Exception('DEP_NOT_EXIST');
    }
    //Start SQL transaction
    let dbTransaction;
    try {
      dbTransaction = await sequelize.transaction();
      //Add Deposit Transaction
      const transactionBusiness = new TransactionBusiness();
      const savedTrans = await transactionBusiness.addTransaction({
          transactionAmount: amount,
          transactionNarrative: 'Deposit Interest (' + _deposit.reference + ')',
          transactionPostingDate: Common.getDate(date, ''),
          transactionCRDR: 'Credit',
          transactionAccount: _deposit.accountId,
          transactionTypeId: _deposit.interestTransType,
          transactionRelatedTransactionId: _deposit.relatedId,
        }, dbTransaction);
      if(!savedTrans) {
        await dbTransaction.rollback();
        throw new Exception('DEP_INT_ADD_FAIL')
      }
      await dbTransaction.commit();
    } catch (err) {
      await dbTransaction.rollback();
      throw new Exception('DEP_INT_ADD_FAIL');
    }
  }

  async releaseDeposit(id, {releaseDate, transCreditType}) {
    const _deposit = await DepositRepo.getDeposit(id);
    if(_deposit === null) {
      throw new Exception('DEP_NOT_EXIST');
    }
    //Start SQL transaction
    let dbTransaction;
    try {
      dbTransaction = await sequelize.transaction();
      //Add Deposit Transaction
      const transactionBusiness = new TransactionBusiness();
      const savedTrans = await transactionBusiness.addTransaction({
          transactionAmount: _deposit.amount,
          transactionNarrative: 'Release Deposit (' + _deposit.reference + ')',
          transactionPostingDate: Common.getDate(releaseDate, ''),
          transactionCRDR: 'Credit',
          transactionAccount: _deposit.accountId,
          transactionTypeId: transCreditType,
          transactionModule: 'DEP',
          transactionRelatedTransactionId: _deposit.relatedId,
        }, dbTransaction);
      if(!savedTrans) {
        await dbTransaction.rollback();
        throw new Exception('DEP_REL_FAIL');
      }
      //Save Deposit related Id
      _deposit.releaseDate = Common.getDate(releaseDate, '');
      _deposit.releaseTransId = savedTrans.transactionId;
      _deposit.status = 'CLOSED';
      await _deposit.save({transaction: dbTransaction});
      await dbTransaction.commit();
    } catch (err) {
      console.log(err);
      await dbTransaction.rollback();
      throw new Exception('DEP_REL_FAIL');
    }
  }

  getDescription(reference, amount, currency, startDate, endDate) {
    return `Deposit Reference (${reference}) with amount ${amount} ${currency}`
        + ` from ${startDate.substring(0, 10)} to ${endDate.substring(0, 10)}`;
  }
}

module.exports = Deposit;
