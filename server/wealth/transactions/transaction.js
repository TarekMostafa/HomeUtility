const Sequelize = require('sequelize');
const sequelize = require('../../db/dbConnection').getSequelize();
const Common = require('../../utilities/common');
const APIResponse = require('../../utilities/apiResponse');
const TransactionRepo = require('./transactionRepo');
const AccountRepo = require('../accounts/accountRepo');
const RelatedTransactionRepo = require('./relatedTransactionRepo');
const ReportRepo = require('../transactionReports/reportRepo');

const Op = Sequelize.Op;

class Transaction {

  async getTransactions({limit, skip, accountId, typeId, postingDateFrom, postingDateTo, narrative}) {

    let _limit = Common.getNumber(limit, 10);
    let _skip = Common.getNumber(skip, 0);
    // Construct Where Condition
    let whereQuery = {};
    // account Id
    if(Common.getText(accountId, '') !== '') {
      whereQuery.transactionAccount = accountId;
    }
    // Transaction Type Id
    if(Common.getText(typeId, '') !== '') {
      whereQuery.transactionTypeId = typeId;
    }
    // Narrative
    if(Common.getText(narrative, '') !== '') {
      whereQuery.transactionNarrative = {
        [Op.substring] : narrative
      }
    }
    // Check Posting Date from and Posting Date To
    let _dateFrom = Common.getDate(postingDateFrom, '', false);
    let _dateTo = Common.getDate(postingDateTo, '', true);
    if( _dateFrom !== '' && _dateTo !== '') {
      whereQuery.transactionPostingDate = { [Op.between] : [_dateFrom, _dateTo] };
    } else {
      if(_dateFrom !== '') {
        whereQuery.transactionPostingDate = { [Op.gte] : _dateFrom };
      } else if(_dateTo !== '') {
        whereQuery.transactionPostingDate = { [Op.lte] : _dateTo };
      }
    }

    const transactions = await TransactionRepo.getTransactions(_skip, _limit, whereQuery);
    return APIResponse.getAPIResponse(true, transactions);
  }

  async getTotalTransactionsByType({reportId, postingDateFrom, postingDateTo}) {
    // Construct Where Condition
    let whereQuery = {};
    // Check Posting Date from and Posting Date To
    const _dateFrom = Common.getDate(postingDateFrom, '', false);
    const _dateTo = Common.getDate(postingDateTo, '', true);
    if( _dateFrom === '' || _dateTo === '') {
      return APIResponse.getAPIResponse(false, null, '043');
    }
    // Get Report Information
    const report = await ReportRepo.getReport(reportId);
    if(!report) {
      return APIResponse.getAPIResponse(false, null, '044');
    }
    const reportdetails = report.reportdetails;
    // Format Result
    const result = [];
    let from = null;
    let to = null;
    do {
      if(from) {
        from = new Date(from.getFullYear(), from.getMonth()+1, 1);
      } else {
        from = new Date(_dateFrom);
      }
      to = new Date(from.getFullYear(), from.getMonth()+1, 0);
      if(to > new Date(_dateTo)){
        to = new Date(_dateTo);
        console.log(to);
      }
      whereQuery.transactionPostingDate = { [Op.between] : [from.setHours(0,0,0), to.setHours(23,59,59)] };
      let resultDetails = {};
      resultDetails.fromDate = from;
      resultDetails.toDate = to;
      resultDetails.monthlyStatistics = [];
      for(let counter = 0; counter < reportdetails.length; counter++) {
        whereQuery.transactionTypeId = { [Op.in] : reportdetails[counter].detailTypes.split(',') };
        const details = await TransactionRepo.getTotalTransactionsGroupByType(whereQuery);
        resultDetails.monthlyStatistics.push({
          detailName: reportdetails[counter].detailName,
          details
        });
      }
      result.push(resultDetails);
    } while(to < new Date(_dateTo))

    return APIResponse.getAPIResponse(true, result);
  }

  async addSingleTransaction(transaction) {
    let dbTransaction;
    try{
      dbTransaction = await sequelize.transaction();
      const result = await this.addTransaction(transaction, dbTransaction);
      if(result.success) {
        await dbTransaction.commit();
      } else {
        await dbTransaction.rollback();
      }
      return result;
    } catch (err) {
      await dbTransaction.rollback();
      return APIResponse.getAPIResponse(false, null, '031');
    }
  }

  async getSingleTransaction(id) {
    const transaction = await TransactionRepo.getTransaction(id);
    return APIResponse.getAPIResponse(true, transaction);
  }

  async editSingleTransaction(id, transaction) {
    let dbTransaction;
    try{
      dbTransaction = await sequelize.transaction();
      let result = await this.editTransaction(id, transaction, dbTransaction);
      if(result.success) {
        await dbTransaction.commit();
      } else {
        await dbTransaction.rollback();
      }
      return result;
    } catch (err) {
      await dbTransaction.rollback();
      return APIResponse.getAPIResponse(false, null, '036');
    }
  }

  async deleteSingleTransaction(id) {
    let dbTransaction;
    try{
      dbTransaction = await sequelize.transaction();
      const result = await this.deleteTransaction(id, dbTransaction);
      if(result.success) {
        await dbTransaction.commit();
      } else {
        await dbTransaction.rollback();
      }
      return result;
    } catch (err) {
      await dbTransaction.rollback();
      return APIResponse.getAPIResponse(false, null, '038');
    }
  }

  async addInternalTransaction(internalTransaction) {
    // Validation
    // Account From must not be equal to Account To
    if(internalTransaction.accountFrom === internalTransaction.accountTo) {
      return APIResponse.getAPIResponse(false, null, '040');
    }
    // Account From Currency must be equal to Account To Currency
    let accountFrom = await AccountRepo.getAccount(internalTransaction.accountFrom);
    if(!accountFrom){
      return APIResponse.getAPIResponse(false, null, '032');
    }
    let accountTo = await AccountRepo.getAccount(internalTransaction.accountTo);
    if(!accountTo){
      return APIResponse.getAPIResponse(false, null, '032');
    }
    if(accountFrom.accountCurrency !== accountTo.accountCurrency) {
      return APIResponse.getAPIResponse(false, null, '041');
    }
    // Begin Transaction
    let dbTransaction;
    try{
      dbTransaction = await sequelize.transaction();
      // Related Transaction
      let relatedTransaction = {
        relatedTransactionType: 'IAT',
        relatedTransactionDesc: ''
      }
      relatedTransaction = await RelatedTransactionRepo.addRelatedTransaction(relatedTransaction, dbTransaction);
      // Debit Side
      let transactionDR = {
        transactionAmount: internalTransaction.amount,
        transactionNarrative: '',
        transactionPostingDate: internalTransaction.postingDate,
        transactionCRDR: 'Debit',
        transactionAccount: internalTransaction.accountFrom,
        transactionTypeId: internalTransaction.typeFrom,
        transactionRelatedTransactionId: relatedTransaction.relatedTransactionsId
      }
      let result = await this.addTransaction(transactionDR, dbTransaction);
      if(!result.success){
        await dbTransaction.rollback();
        return result;
      }
      // Credit Side
      let transactionCR = {
        transactionAmount: internalTransaction.amount,
        transactionNarrative: '',
        transactionPostingDate: internalTransaction.postingDate,
        transactionCRDR: 'Credit',
        transactionAccount: internalTransaction.accountTo,
        transactionTypeId: internalTransaction.typeTo,
        transactionRelatedTransactionId: relatedTransaction.relatedTransactionsId
      }
      result = await this.addTransaction(transactionCR, dbTransaction);
      if(result.success) {
        await dbTransaction.commit();
      } else {
        await dbTransaction.rollback();
      }
      return result;
    } catch (err) {
      await dbTransaction.rollback();
      return APIResponse.getAPIResponse(false, null, '031');
    }
  }

  evalTransactionAmount(amount, type, isRollback) {
    if( (!isRollback && type === 'Debit') || (isRollback  && type === 'Credit') ) {
      return amount * -1;
    } else if ( (isRollback && type === 'Debit') || (!isRollback  && type === 'Credit') ) {
      return amount * 1;
    } else {
      return null;
    }
  }

  async addTransaction(transaction, dbTransaction) {
    // Get account related to this transaction
    let account = await AccountRepo.getAccount(transaction.transactionAccount);
    if(!account){
      return APIResponse.getAPIResponse(false, null, '032');
    }
    //Increase/Decrease account balance depending on transaction CRDR field
    const amount = this.evalTransactionAmount(transaction.transactionAmount,
      transaction.transactionCRDR, false);
    if(!amount) {
      return APIResponse.getAPIResponse(false, null, '033');
    }
    // Save Transaction
    await TransactionRepo.addTransaction(transaction, dbTransaction);
    // Update Account Current Balance & Last Balance Update
    await this.accountCurrentBalanceUpdate(account, amount, dbTransaction);
    return APIResponse.getAPIResponse(true, null, '030');
  }

  async deleteTransaction(id, dbTransaction) {
    // Get Saved transaction that want to be deleted
    let _transaction = await TransactionRepo.getTransaction(id);
    if(!_transaction) {
      return APIResponse.getAPIResponse(false, null, '034');
    }
    // Get account related to saved transaction
    let _account = await AccountRepo.getAccount(_transaction.transactionAccount);
    if(!_account){
      return APIResponse.getAPIResponse(false, null, '032');
    }
    // Rollback
    const amount = this.evalTransactionAmount(_transaction.transactionAmount,
      _transaction.transactionCRDR, true);
    if(!amount) {
      return APIResponse.getAPIResponse(false, null, '033');
    }
    // Delete Transaction
    await _transaction.destroy({transaction: dbTransaction});
    // Update Account
    await this.accountCurrentBalanceUpdate(_account, amount, dbTransaction);
    return APIResponse.getAPIResponse(true, null, '037');
  }

  async editTransaction(id, transaction, dbTransaction) {
    // Get Saved transaction that want to be updated
    let _transaction = await TransactionRepo.getTransaction(id);
    if(!_transaction) {
      return APIResponse.getAPIResponse(false, null, '034');
    }
    // Get account related to saved transaction
    let _account = await AccountRepo.getAccount(_transaction.transactionAccount);
    if(!_account){
      return APIResponse.getAPIResponse(false, null, '032');
    }
    // Rollback
    let amountRollback = this.evalTransactionAmount(_transaction.transactionAmount,
      _transaction.transactionCRDR, true);
    if(!amountRollback) {
      return APIResponse.getAPIResponse(false, null, '033');
    }
    // Get account related to passed transaction
    let account = await AccountRepo.getAccount(transaction.transactionAccount);
    if(!account){
      return APIResponse.getAPIResponse(false, null, '032');
    }
    //Increase/Decrease account balance depending on transaction CRDR field
    let amount = this.evalTransactionAmount(transaction.transactionAmount,
      transaction.transactionCRDR, false);
    if(!amount) {
      return APIResponse.getAPIResponse(false, null, '033');
    }
    // update transaction
    _transaction.transactionAmount = transaction.transactionAmount;
    _transaction.transactionNarrative = transaction.transactionNarrative;
    _transaction.transactionPostingDate = transaction.transactionPostingDate;
    _transaction.transactionCRDR = transaction.transactionCRDR;
    _transaction.transactionAccount = transaction.transactionAccount;
    _transaction.transactionTypeId = transaction.transactionTypeId;
    await _transaction.save({transaction: dbTransaction});
    if(_account.accountId !== account.accountId) {
      await this.accountCurrentBalanceUpdate(_account, amountRollback, dbTransaction);
      await this.accountCurrentBalanceUpdate(account, amount, dbTransaction);
    } else {
      await this.accountCurrentBalanceUpdate(_account, amountRollback+amount, dbTransaction);
    }
    return APIResponse.getAPIResponse(true, null, '035');
  }

  async accountCurrentBalanceUpdate(account, amount, dbTransaction) {
    await account.update(
      {accountCurrentBalance: sequelize.literal('accountCurrentBalance+'+amount),
      accountLastBalanceUpdate: sequelize.fn('NOW')},
      {transaction: dbTransaction});
  }
}

module.exports = Transaction;
