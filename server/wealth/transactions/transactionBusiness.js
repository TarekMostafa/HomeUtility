const Sequelize = require('sequelize');
//const APIResponse = require('../../utilities/apiResponse');
const TransactionRepo = require('./transactionRepo');
const AccountRepo = require('../accounts/accountRepo');
const Common = require('../../utilities/common');
const ReportRepo = require('../transactionReports/reportRepo');
const Exception = require('../../features/exception');
const AppParametersRepo = require('../../appSettings/appParametersRepo');
const AppParametersConstants = require('../../appSettings/appParametersConstants');

const Op = Sequelize.Op;

class TransactionBusiness {

  async getTransactions({limit, skip, accountIds, typeIds, postingDateFrom,
    postingDateTo, narrative, id, includeNarrative}) {

    limit = Common.getNumber(limit, 10);
    skip = Common.getNumber(skip, 0);
    // Construct Where Condition
    let whereQuery = {};
    // account Id
    if(accountIds) {
      //whereQuery.transactionAccount = accountId;
      whereQuery.transactionAccount = {
        [Op.in]: accountIds
      }
    }
    // Transaction Type Id
    if(typeIds) {
      //whereQuery.transactionTypeId = typeId;
      whereQuery.transactionTypeId = {
        [Op.in]: typeIds
      }
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

    let transactions = await TransactionRepo.getTransactions(skip, limit, whereQuery);
    transactions = await Promise.all(transactions.map(async trans => {
      const migration = await this.getMigrationObject(trans);
      return {
        transactionId: trans.transactionId,
        transactionPostingDate: trans.transactionPostingDate,
        transactionAmount: trans.transactionAmount,
        transactionCRDR: trans.transactionCRDR,
        transactionNarrative: trans.transactionNarrative,
        transactionRelatedTransactionId: trans.transactionRelatedTransactionId,
        transactionModule: trans.transactionModule,
        accountNumber: trans.account.accountNumber,
        accountCurrency: trans.account.accountCurrency,
        currencyRateAgainstBase: trans.account.currency.currencyRateAgainstBase,
        currencyDecimalPlace: trans.account.currency.currencyDecimalPlace,
        typeName: (trans.transactionType? trans.transactionType.typeName: ''),
        migrationType: migration.type,
        migrationText: migration.text,
      }
    }));
    return transactions;
  }

  async getTotalTransactionsByType({reportId, postingDateFrom, postingDateTo}) {
    // Construct Where Condition
    let whereQuery = {};
    // Check Posting Date from and Posting Date To
    const _dateFrom = Common.getDate(postingDateFrom, '', false);
    const _dateTo = Common.getDate(postingDateTo, '', true);
    if( _dateFrom === '' || _dateTo === '') {
      //return APIResponse.getAPIResponse(false, null, '043');
      throw new Exception('POST_DATE_INVALID');
    }
    // Get Report Information
    const report = await ReportRepo.getReport(reportId);
    if(!report) {
      throw new Exception('REPORT_ID_INVALID');
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

    return result;
  }

  async getTransaction(id) {
    let transaction = await TransactionRepo.getTransaction(id);
    const migration = await this.getMigrationObject(transaction);
    transaction = {
      transactionId: transaction.transactionId,
      transactionAmount: transaction.transactionAmount,
      transactionNarrative: transaction.transactionNarrative,
      transactionPostingDate: transaction.transactionPostingDate,
      transactionCRDR: transaction.transactionCRDR,
      transactionAccount: transaction.transactionAccount,
      transactionTypeId: transaction.transactionTypeId,
      transactionRelatedTransactionId: transaction.transactionRelatedTransactionId,
      transactionModule: transaction.transactionModule,
      accountCurrency: transaction.account.accountCurrency,
      currencyDecimalPlace: transaction.account.currency.currencyDecimalPlace,
      transactionModuleId: transaction.transactionModuleId,
      migrationType: migration.type,
      migrationText: migration.text,
    };
    return transaction;
  }

  async addTransaction({transactionAmount, transactionNarrative, transactionPostingDate,
    transactionCRDR, transactionAccount, transactionTypeId, transactionRelatedTransactionId,
    transactionModule, transactionModuleId}, dbTransaction) {
    // Get account related to this transaction
    let account = await AccountRepo.getAccount(transactionAccount);
    if(!account){
      throw new Exception('ACC_INVALID');
    }
    //Increase/Decrease account balance depending on transaction CRDR field
    const amount = this.evalTransactionAmount(transactionAmount,
      transactionCRDR, false);
    if(!amount) {
      throw new Exception('TRANS_TYPE_INVALID');
    }
    // Save Transaction
    const savedTrans = await TransactionRepo.addTransaction({
      transactionAmount,
      transactionNarrative,
      transactionPostingDate,
      transactionCRDR,
      transactionAccount,
      transactionTypeId,
      transactionRelatedTransactionId,
      transactionModule,
      transactionModuleId,
    }, dbTransaction);
    // Update Account Current Balance & Last Balance Update
    await AccountRepo.updateAccountCurrentBalance(account, amount, dbTransaction);
    //return APIResponse.getAPIResponse(true, savedTrans, '030');
    return savedTrans;
  }

  async deleteTransaction(id, dbTransaction) {
    // Get Saved transaction that want to be deleted
    let _transaction = await TransactionRepo.getTransaction(id);
    if(!_transaction) {
      throw new Exception('TRANS_NOT_EXIST');
    }
    // Get account related to saved transaction
    let _account = await AccountRepo.getAccount(_transaction.transactionAccount);
    if(!_account){
      throw new Exception('ACC_INVALID');
    }
    // Rollback
    const amount = this.evalTransactionAmount(_transaction.transactionAmount,
      _transaction.transactionCRDR, true);
    if(!amount) {
      throw new Exception('TRANS_TYPE_INVALID');
    }
    // Delete Transaction
    await _transaction.destroy({transaction: dbTransaction});
    // Update Account
    await AccountRepo.updateAccountCurrentBalance(_account, amount, dbTransaction);
    //return APIResponse.getAPIResponse(true, null, '037');
    return true;
  }

  async editTransaction(id, {transactionAmount, transactionNarrative, transactionPostingDate,
    transactionCRDR, transactionAccount, transactionTypeId, transactionModuleId,
    transactionRelatedTransactionId, transactionModule}, dbTransaction) {
    // Get Saved transaction that want to be updated
    let _transaction = await TransactionRepo.getTransaction(id);
    if(!_transaction) {
      throw new Exception('TRANS_NOT_EXIST');
    }
    // Get account related to saved transaction
    let _account = await AccountRepo.getAccount(_transaction.transactionAccount);
    if(!_account){
      throw new Exception('ACC_INVALID');
    }
    // Rollback
    let amountRollback = this.evalTransactionAmount(_transaction.transactionAmount,
      _transaction.transactionCRDR, true);
    if(!amountRollback) {
      throw new Exception('TRANS_TYPE_INVALID');
    }
    // Get account related to passed transaction
    let account = await AccountRepo.getAccount(transactionAccount);
    if(!account){
      throw new Exception('ACC_INVALID');
    }
    //Increase/Decrease account balance depending on transaction CRDR field
    let amount = this.evalTransactionAmount(transactionAmount,
      transactionCRDR, false);
    if(!amount) {
      throw new Exception('TRANS_TYPE_INVALID');
    }
    // update transaction
    _transaction.transactionAmount = transactionAmount;
    _transaction.transactionNarrative = transactionNarrative;
    _transaction.transactionPostingDate = transactionPostingDate;
    _transaction.transactionCRDR = transactionCRDR;
    _transaction.transactionAccount = transactionAccount;
    _transaction.transactionTypeId = transactionTypeId;
    if(transactionModuleId)
      _transaction.transactionModuleId = transactionModuleId;
    if(transactionRelatedTransactionId)  
      _transaction.transactionRelatedTransactionId = transactionRelatedTransactionId;
    if(transactionModule)
      _transaction.transactionModule = transactionModule;
    await _transaction.save({transaction: dbTransaction});
    if(_account.accountId !== account.accountId) {
      await AccountRepo.updateAccountCurrentBalance(_account, amountRollback, dbTransaction);
      await AccountRepo.updateAccountCurrentBalance(account, amount, dbTransaction);
    } else {
      await AccountRepo.updateAccountCurrentBalance(_account, amountRollback+amount, dbTransaction);
    }
    //return APIResponse.getAPIResponse(true, null, '035');
    return true;
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

  async getMigrationObject(transaction){

    let migration = {
      type: '',
      text: '',
    };

    const typeCRDebt = await AppParametersRepo.getAppParameterValue(
      AppParametersConstants.DEBT_TRANSACTION_CREDIT);
    const typeDRDebt = await AppParametersRepo.getAppParameterValue(
      AppParametersConstants.DEBT_TRANSACTION_DEBIT);

    if((transaction.transactionTypeId == typeCRDebt ||
      transaction.transactionTypeId == typeDRDebt) && 
      !transaction.transactionRelatedTransactionId)
    {
      migration.type = 'DBT';
      migration.text = 'Convert To Debt';
      return migration;
    }

    const modules = await AppParametersRepo.getAppParameterValue(
      AppParametersConstants.LINK_MODULES_TO_DEBTOR);
    const modArray = modules.split(',');
    if(modArray.includes(transaction.transactionModule) && 
      !transaction.transactionRelatedTransactionId)
    {
      migration.type = 'LNK';
      migration.text = 'Link To Debtor';
      return migration;
    }

    return migration;
  }

}

module.exports = TransactionBusiness;
