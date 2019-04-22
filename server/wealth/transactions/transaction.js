const Sequelize = require('sequelize');
const sequelize = require('../../db/dbConnection').getSequelize();
const Common = require('../../utilities/common');
const APIResponse = require('../../utilities/apiResponse');
const TransactionModel = require('./transactionModel');
const AccountModel = require('../accounts/accountModel');
const CurrencyModel = require('../../currencies/currencyModel');
const TransactionTypeModel = require('../transactionTypes/transactionTypeModel');

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

    const transactions = await TransactionModel.findAll({
      offset: _skip,
      limit: _limit,
      attributes: ['transactionId', 'transactionPostingDate', 'transactionAmount',
        'transactionCRDR', 'transactionNarrative', 'transactionRelatedTransactionId'],
      include: [
        { model: AccountModel, as: 'account', attributes: ['accountNumber','acccountCurrency'],
          include: [
            { model: CurrencyModel, as: 'currency', attributes: ['currencyRateAgainstBase', 'currencyDecimalPlace'] }
          ]
        },
        { model: TransactionTypeModel, as: 'transactionType', attributes: ['typeName'] }
      ],
      where: whereQuery,
      order: [ ['transactionPostingDate', 'DESC'] , ['transactionId', 'DESC'] ]
    });
    return APIResponse.getAPIResponse(true, transactions);
  }

  async addSingleTransaction(transaction) {
    // Get account related to this transaction
    let account = await AccountModel.findByPk(transaction.transactionAccount);
    if(!account){
      return APIResponse.getAPIResponse(false, null, '032');
    }
    //Increase/Decrease account balance depending on transaction CRDR field
    if(transaction.transactionCRDR === 'Credit') {
      account.accountCurrentBalance = eval(account.accountCurrentBalance) + eval(transaction.transactionAmount);
    } else if(transaction.transactionCRDR === 'Debit') {
      account.accountCurrentBalance = eval(account.accountCurrentBalance) - eval(transaction.transactionAmount);
    } else {
      return APIResponse.getAPIResponse(false, null, '033');
    }
    // Update date for field balance last update
    account.accountLastBalanceUpdate = sequelize.fn('NOW');
    // Save transaction and account
    let dbTransaction;
    try{
      dbTransaction = await sequelize.transaction();
      await TransactionModel.build(transaction).save({transaction: dbTransaction});
      await account.save({transaction: dbTransaction});
      await dbTransaction.commit();
      return APIResponse.getAPIResponse(true, null, '030');
    } catch (err) {
      await dbTransaction.rollback();
      return APIResponse.getAPIResponse(false, null, '031');
    }
  }

}

module.exports = Transaction;
