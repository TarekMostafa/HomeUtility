const Sequelize = require('sequelize');
//const APIResponse = require('../../utilities/apiResponse');
const TransactionRepo = require('./transactionRepo');
const AccountRepo = require('../accounts/accountRepo');
const Common = require('../../utilities/common');
const ReportRepo = require('../transactionReports/reportRepo');
const Exception = require('../../features/exception');
const AppParametersRepo = require('../../appSettings/appParametersRepo');
const AppParametersConstants = require('../../appSettings/appParametersConstants');
const DebtorRepo = require('../../debtors/debtorRepo');
const transactionModules = require('./transactionModules');
const AmountHelper = require('../../helper/AmountHelper');
const CurrencyRepo = require('../../currencies/currencyRepo');

const Op = Sequelize.Op;
const TransactionModules = transactionModules.Modules;

class TransactionBusiness {

  async getTransactions({limit, skip, accountIds, typeIds, postingDateFrom,
    postingDateTo, narrative, id, includeNarrative, currencies, dateType, payForOthers,
    label1, label2, label3, label4, label5}) {

    limit = Common.getNumber(limit, 10);
    skip = Common.getNumber(skip, 0);
    // Construct Where Conditions
    let whereQuery = {};
    let accountWhereQuery = {};
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
    // Currency
    if(currencies) {
      accountWhereQuery.accountCurrency = {
        [Op.in]: currencies
      }
    }
    //dateType will control if Posting Date or Value Date, by default Posting Date
    // Check Posting Date from and Posting Date To
    let _dateFrom = Common.getDate(postingDateFrom, '');
    let _dateTo = Common.getDate(postingDateTo, '');
    if( _dateFrom !== '' && _dateTo !== '') {
      if(dateType==='VALUE') whereQuery.transactionValueDate = { [Op.between] : [_dateFrom, _dateTo] }; 
      else whereQuery.transactionPostingDate = { [Op.between] : [_dateFrom, _dateTo] };   
    } else {
      if(_dateFrom !== '') {
        if(dateType==='VALUE') whereQuery.transactionValueDate = { [Op.gte] : _dateFrom };
        else whereQuery.transactionPostingDate = { [Op.gte] : _dateFrom };
      } else if(_dateTo !== '') {
        if(dateType==='VALUE') whereQuery.transactionValueDate = { [Op.lte] : _dateTo };
        else whereQuery.transactionPostingDate = { [Op.lte] : _dateTo };
      }
    }
    //Transaction Id
    if(id){
      whereQuery.transactionId = id;
    }
    //Pay for Others
    if(payForOthers!== null && payForOthers!== undefined)
      whereQuery.transactionPayForOthers = payForOthers;
    //Labels
    if(label1) whereQuery.transactionLabel1 = label1;
    if(label2) whereQuery.transactionLabel2 = label2;
    if(label3) whereQuery.transactionLabel3 = label3;
    if(label4) whereQuery.transactionLabel4 = label4;
    if(label5) whereQuery.transactionLabel5 = label5;

    let transactions = await TransactionRepo.getTransactions(skip, limit, whereQuery, accountWhereQuery);
    await this.loadParameters(); //to load parameters once
    transactions = await Promise.all(transactions.map(async trans => {
      const migration = await this.getMigrationObject(trans);
      const module = transactionModules.getModule(trans.transactionModule);
      return {
        transactionId: trans.transactionId,
        transactionPostingDate: trans.transactionPostingDate,
        transactionAmount: trans.transactionAmount,
        transactionAmountFormatted: 
          AmountHelper.formatAmount(trans.transactionAmount, trans.account.currency.currencyDecimalPlace),
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
        relatedType: trans.relatedTransaction? trans.relatedTransaction.relatedTransactionType: '',
        isEditable: module? module.IsEditable: true,
        isDeletable: module? module.IsDeletable: true,
      }
    }));
    return transactions;
  }

  async getTotalTransactionsByType({reportId, postingDateFrom, postingDateTo, currency, dateType}) {
    // Construct Where Condition
    let whereQuery = {};
    // Check Posting Date from and Posting Date To
    const _dateFrom = Common.getDate(postingDateFrom, '');
    const _dateTo = Common.getDate(postingDateTo, '');
    if( _dateFrom === '' || _dateTo === '') {
      //return APIResponse.getAPIResponse(false, null, '043');
      throw new Exception('POST_DATE_INVALID');
    }
    //Check Currency
    const currencyObj = await CurrencyRepo.getCurrency(currency);
    if(!currencyObj) throw new Exception('CURR_NOT_EXIST', currency);
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
        //from = new Date(from.getFullYear(), from.getMonth()+1, 1);
        from.setMonth(from.getMonth()+1);
      } else {
        from = new Date(_dateFrom);
      }
      //to = new Date(from.getFullYear(), from.getMonth()+1, 0);
      to = new Date(_dateFrom);
      to.setFullYear(from.getFullYear());
      to.setMonth(from.getMonth()+1);
      to.setDate(0);
      if(to > new Date(_dateTo)){
        to = new Date(_dateTo);
      }
      //Check dateType
      if(dateType==='VALUE') {
        whereQuery.transactionValueDate = { [Op.between] : [Common.getDate(from.toISOString(), ''), 
          Common.getDate(to.toISOString(), '')] };
      } else {
        whereQuery.transactionPostingDate = { [Op.between] : [Common.getDate(from.toISOString(), ''), 
          Common.getDate(to.toISOString(), '')] };
      }
      //Exclude pay for others
      whereQuery.transactionPayForOthers = false;
      //set result details
      let resultDetails = {};
      resultDetails.fromDate = Common.getDate(from.toISOString(), '');
      resultDetails.toDate = Common.getDate(to.toISOString(), '');
      resultDetails.currency = currencyObj.currencyCode;
      resultDetails.monthlyStatistics = [];

      let currencyDecimalPlace = 0;
      let finalTotal = 0;
      for(let counter = 0; counter < reportdetails.length; counter++) {

        let totalItem = 0;

        whereQuery.transactionTypeId = { [Op.or] : [
          {[Op.in] : reportdetails[counter].detailTypes.split(',')},
          {[Op.eq] : null}
        ]};
        let details = await TransactionRepo.getTotalTransactionsGroupByType(whereQuery, currency);
        details = details.map( detail => {
          currencyDecimalPlace = detail.currencyDecimalPlace;
          totalItem = Number(totalItem) + Math.abs(detail.total);
          finalTotal = Number(finalTotal) + Number(detail.total);
          return {
            total: Math.abs(detail.total),
            totalFormatted: AmountHelper.formatAmount(Math.abs(detail.total), 
              currencyObj.currencyDecimalPlace),
            typeName: detail.typeName,
            typeId: detail.typeId
          }
        });
        resultDetails.monthlyStatistics.push({
          detailName: reportdetails[counter].detailName,
          totalItem: totalItem,
          totalItemFormatted: AmountHelper.formatAmount(totalItem, 
            currencyObj.currencyDecimalPlace),
          details
        });
      }
      resultDetails.finalTotal = finalTotal;
      resultDetails.finalTotalFormatted = AmountHelper.formatAmount(finalTotal, 
        currencyObj.currencyDecimalPlace); 
      result.push(resultDetails);
    } while(to < new Date(_dateTo))

    return result;
  }

  async getTotalTransactionsByLabel({label, currency, dateFrom, dateTo}) {
    // Construct Where Condition
    let whereQuery = {};
    //Check Currency
    const currencyObj = await CurrencyRepo.getCurrency(currency);
    if(!currencyObj) throw new Exception('CURR_NOT_EXIST', currency);
    // Check Posting Date from and Posting Date To
    const _dateFrom = Common.getDate(dateFrom, '');
    const _dateTo = Common.getDate(dateTo, '');
    if( _dateFrom === '' || _dateTo === '') {
        throw new Exception('POST_DATE_INVALID');
    }

    whereQuery.transactionPostingDate = { [Op.between] : [_dateFrom, _dateTo] };

    let details = await TransactionRepo.getTotalTransactionsGroupByLabel(label, currency, whereQuery);
    let labelTotal = 0;
    details = details.map(detail => {
      labelTotal += Number(detail.total);
      return {
        total: detail.total,
        totalFormatted: AmountHelper.formatAmount(detail.total, 
                currencyObj.currencyDecimalPlace),
        label: detail.label,
      }
    });

    return {
      label,
      currency,
      dateFrom: _dateFrom,
      dateTo: _dateTo,
      details,
      labelTotal,
      labelTotalFormatted: AmountHelper.formatAmount(labelTotal, 
        currencyObj.currencyDecimalPlace)
    }
  }

  async getTransaction(id) {
    let transaction = await TransactionRepo.getTransaction(id);
    //find debtor Id
    let debtorId = null;
    //in case of debtor module
    if(transaction.transactionModule === TransactionModules.DEBT.Code){
      debtorId = transaction.transactionModuleId;
    } else { //in case of not a debtor module
      if(transaction.transactionRelatedTransactionId) {
        const debtor = await DebtorRepo.getDebtorByRelId(transaction.transactionRelatedTransactionId);
        if(debtor) {
          debtorId = debtor.debtId;
        }
      }
    }

    const showLabels = await AppParametersRepo.getAppParameterValue(
      AppParametersConstants.SHOW_TRANSACTION_LABELS);

    transaction = {
      transactionId: transaction.transactionId,
      transactionAmount: transaction.transactionAmount,
      transactionAmountFormatted: 
          AmountHelper.formatAmount(transaction.transactionAmount, 
            transaction.account.currency.currencyDecimalPlace),
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
      debtorId: debtorId,
      isLabelActivated: (showLabels===AppParametersConstants.YES?true:false),
      labels: (showLabels===AppParametersConstants.YES? {
        label1: transaction.transactionLabel1,
        label2: transaction.transactionLabel2,
        label3: transaction.transactionLabel3,
        label4: transaction.transactionLabel4,
        label5: transaction.transactionLabel5,
      } : null)
    };
    return transaction;
  }

  async addTransaction({transactionAmount, transactionNarrative, transactionPostingDate,
    transactionCRDR, transactionAccount, transactionTypeId, transactionRelatedTransactionId,
    transactionModule, transactionModuleId, transactionValueDate}, dbTransaction) {
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
      transactionPostingDate: Common.getDate(transactionPostingDate, ''),
      transactionCRDR,
      transactionAccount,
      transactionTypeId,
      transactionRelatedTransactionId,
      transactionModule,
      transactionModuleId,
      transactionValueDate: (transactionValueDate?
        Common.getDate(transactionValueDate, ''):
        Common.getDate(transactionPostingDate, ''))
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
    transactionRelatedTransactionId, transactionModule, transactionValueDate, transactionPayForOthers}, 
    dbTransaction) {
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
    _transaction.transactionPostingDate = Common.getDate(transactionPostingDate, '');
    if(transactionValueDate) {
      _transaction.transactionValueDate = Common.getDate(transactionValueDate, '');
    } else {
      _transaction.transactionValueDate = Common.getDate(transactionPostingDate, '');
    }
    _transaction.transactionCRDR = transactionCRDR;
    _transaction.transactionAccount = transactionAccount;
    _transaction.transactionTypeId = transactionTypeId;
    if(transactionModuleId)
      _transaction.transactionModuleId = transactionModuleId;
    if(transactionRelatedTransactionId) {
      if(transactionRelatedTransactionId === 'NULL') {
        _transaction.transactionRelatedTransactionId = null;
      } else {
        _transaction.transactionRelatedTransactionId = transactionRelatedTransactionId;
      }
    } 
      
    if(transactionModule)
      _transaction.transactionModule = transactionModule;
    
    if(transactionPayForOthers!== null && transactionPayForOthers !== undefined)
      _transaction.transactionPayForOthers = (transactionPayForOthers===true);

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
      migration.type = 'DBT_CNV';
      migration.text = 'Convert To Debt';
      return migration;
    }

    const modules = await AppParametersRepo.getAppParameterValue(
      AppParametersConstants.LINK_MODULES_TO_DEBTOR);
    const modArray = modules.split(',');
    if(modArray.includes(transaction.transactionModule)) {
      if(!transaction.transactionRelatedTransactionId) {
        migration.type = 'DBT_LNK';
        migration.text = 'Link To Debtor';
        return migration;
      } else {
        if(transaction.relatedtransaction && 
          transaction.relatedtransaction.relatedTransactionType === 'DBT'){
            migration.type = 'DBT_RLS';
            migration.text = 'Release From Debtor';
            return migration;
          }
      }
    }

    return migration;
  }

  async getAccountBalanceAsOfDate({accountId, balanceDate}){
    const account = await AccountRepo.getAccount(accountId);
    if(!account) throw new Exception('ACC_INVALID');

    const _balanceDate = Common.getDate(balanceDate, '');
    const resultObj = await TransactionRepo.getAccountBalanceAsOfDate(accountId, balanceDate);

    const decimalPlace = account.currency.currencyDecimalPlace;
    const transBalance = parseFloat(resultObj.balanceSum).toFixed(decimalPlace);
    const startBalance = parseFloat(account.accountStartBalance).toFixed(decimalPlace);
    const balance = (Number(transBalance)+Number(startBalance)).toFixed(decimalPlace);
    return {
      balance: balance,
      balanceFormatted: AmountHelper.formatAmount(balance, decimalPlace),
      currency: account.accountCurrency,
      currencyDecimalPlace: decimalPlace,
      balanceDate: _balanceDate
    }
  }

  async loadParameters() {
    await AppParametersRepo.getAppParameterValue(
      AppParametersConstants.DEBT_TRANSACTION_CREDIT);
    await AppParametersRepo.getAppParameterValue(
      AppParametersConstants.DEBT_TRANSACTION_DEBIT);
    await AppParametersRepo.getAppParameterValue(
      AppParametersConstants.LINK_MODULES_TO_DEBTOR);
  }

  async editTransactionLabels(id, {label1, label2, label3, label4, label5}) {
    // Get Saved transaction that want to be updated
    let _transaction = await TransactionRepo.getTransaction(id);
    if(!_transaction) {
      throw new Exception('TRANS_NOT_EXIST');
    }

    _transaction.transactionLabel1 = (label1? label1: null);
    _transaction.transactionLabel2 = (label2? label2: null);
    _transaction.transactionLabel3 = (label3? label3: null);
    _transaction.transactionLabel4 = (label4? label4: null);
    _transaction.transactionLabel5 = (label5? label5: null);
    await _transaction.save();
  }
}

module.exports = TransactionBusiness;
