const Sequelize = require('sequelize');
const APIResponse = require('../../utilities/apiResponse');
const TransactionRepo = require('./transactionRepo');
const AccountRepo = require('../accounts/accountRepo');
const Common = require('../../utilities/common');
const ReportRepo = require('../transactionReports/reportRepo');

const Op = Sequelize.Op;

class Transaction {

  async getTransactions({limit, skip, accountId, typeId, postingDateFrom,
    postingDateTo, narrative, id, includeNarrative}) {

    limit = Common.getNumber(limit, 10);
    skip = Common.getNumber(skip, 0);
    // Construct Where Condition
    let whereQuery = {};
    // account Id
    if(accountId) {
      whereQuery.transactionAccount = accountId;
    }
    // Transaction Type Id
    if(typeId) {
      whereQuery.transactionTypeId = typeId;
    }
    // Narrative
    if(narrative) {
      if(includeNarrative==='true') {
        whereQuery.transactionNarrative = {
          [Op.substring] : narrative
        }
      } else {
        whereQuery.transactionNarrative = {
          [Op.notLike] : '%'+narrative.trim()+'%'
        }
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
    //Transaction Id
    if(id){
      whereQuery.transactionId = id;
    }

    const transactions = await TransactionRepo.getTransactions(skip, limit, whereQuery);
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
        whereQuery.transactionTypeId = { [Op.or] : [
          {[Op.in] : reportdetails[counter].detailTypes.split(',')},
          {[Op.eq] : null}
        ]};
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

  async getTransaction(id) {
    const transaction = await TransactionRepo.getTransaction(id);
    return APIResponse.getAPIResponse(true, transaction);
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
    const savedTrans = await TransactionRepo.addTransaction(transaction, dbTransaction);
    // Update Account Current Balance & Last Balance Update
    await AccountRepo.updateAccountCurrentBalance(account, amount, dbTransaction);
    return APIResponse.getAPIResponse(true, savedTrans, '030');
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
    await AccountRepo.updateAccountCurrentBalance(_account, amount, dbTransaction);
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
      await AccountRepo.updateAccountCurrentBalance(_account, amountRollback, dbTransaction);
      await AccountRepo.updateAccountCurrentBalance(account, amount, dbTransaction);
    } else {
      await AccountRepo.updateAccountCurrentBalance(_account, amountRollback+amount, dbTransaction);
    }
    return APIResponse.getAPIResponse(true, null, '035');
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

}

module.exports = Transaction;
