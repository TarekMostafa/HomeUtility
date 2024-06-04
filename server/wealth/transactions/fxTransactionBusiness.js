const Sequelize = require('sequelize');
const sequelize = require('../../db/dbConnection').getSequelize();
const TransactionBusiness = require('./transactionBusiness');
const RelatedTransactionRepo = require('../relatedTransactions/relatedTransactionRepo');
const FXTransactionRepo = require('./fxTransactionRepo');
const AccountRepo = require('../accounts/accountRepo');
const Exception = require('../../features/exception');
const AppParametersRepo = require('../../appSettings/appParametersRepo');
const AppParametersConstants = require('../../appSettings/appParametersConstants');
const Common = require('../../utilities/common');
const TransactionModules = require('./transactionModules').Modules;
const CurrencyRepo = require('../../currencies/currencyRepo');

const Op = Sequelize.Op;

class FXTransactionBusiness {
    constructor(){
        this.transactionBusiness = new TransactionBusiness();
    }

    async getDefaultData() {
        const typeFrom = await AppParametersRepo.getAppParameterValue(
            AppParametersConstants.FX_TRANSACTION_TYPE_FROM); 
        const typeTo = await AppParametersRepo.getAppParameterValue(
            AppParametersConstants.FX_TRANSACTION_TYPE_TO);

        return {
            accountFrom: '',
            typeFrom,
            postingDate: '',
            amountFrom:0,
            amountTo: 0,
            accountTo: '',
            typeTo,
        }
    }

    async addFXTransaction({accountFrom, accountTo, typeFrom, typeTo, postingDateFrom, 
        rate, amountFrom, amountTo, postingDateTo}) {
        // Validation
        // Account From must not be equal to Account To
        if(accountFrom === accountTo) {
            throw new Exception('TRANS_ACC1_NOT_EQUAL_ACC2');
        }
        // Account From Currency must not be equal to Account To Currency
        let _accountFrom = await AccountRepo.getAccount(accountFrom);
        if(!_accountFrom){
            throw new Exception('ACC_INVALID');
        }
        let _accountTo = await AccountRepo.getAccount(accountTo);
        if(!_accountTo){
            throw new Exception('ACC_INVALID');
        }
        if(_accountFrom.accountCurrency === _accountTo.accountCurrency) {
            throw new Exception('TRANS_CCY1_NOTEQUAL_CCY2');
        }
        // Begin Transaction
        let dbTransaction;
        try{
            dbTransaction = await sequelize.transaction();
            // Related Transaction
            let relatedTransaction = {
                relatedTransactionType: 'FX',
                relatedTransactionDesc: this.getDescription(_accountFrom.accountBankCode,
                    _accountFrom.accountNumber, _accountTo.accountBankCode, _accountTo.accountNumber,
                    amountFrom, amountTo, _accountFrom.accountCurrency, _accountTo.accountCurrency,
                    postingDateFrom, rate)
            }
            relatedTransaction = await RelatedTransactionRepo.addRelatedTransaction(relatedTransaction, dbTransaction);
            // Add FX Transaction
            let fxTransaction = {
                fxRelTransId: relatedTransaction.relatedTransactionsId,
                fxAmountFrom: amountFrom,
                fxAmountTo: amountTo,
                fxPostingDateFrom: Common.getDate(postingDateFrom, ''),
                fxRate: rate,
                fxAccountFrom: accountFrom,
                fxAccountTo: accountTo,
                fxCurrencyFrom: _accountFrom.accountCurrency,
                fxCurrencyTo: _accountTo.accountCurrency,
                fxPostingDateTo: Common.getDate(postingDateTo, '')
            }
            fxTransaction = await FXTransactionRepo.addTransaction(fxTransaction, dbTransaction);
            // Debit Side
            let transactionDR = {
                transactionAmount: amountFrom,
                transactionNarrative: 'Forex ('+ amountTo + ' ' +
                    _accountTo.accountCurrency + ' / ' + rate + ')',
                transactionPostingDate: Common.getDate(postingDateFrom, ''),
                transactionCRDR: 'Debit',
                transactionAccount: accountFrom,
                transactionTypeId: typeFrom,
                transactionRelatedTransactionId: relatedTransaction.relatedTransactionsId,
                transactionModule: TransactionModules.FX.Code,
                transactionModuleId: fxTransaction.fxId,
            }
            let savedTrans = await this.transactionBusiness.addTransaction(transactionDR, dbTransaction);
            if(!savedTrans){
                await dbTransaction.rollback();
                throw new Exception('TRANS_ADD_FAIL');
            }
            // Credit Side
            let transactionCR = {
                transactionAmount: amountTo,
                transactionNarrative: 'Forex ('+ amountFrom + ' ' +
                    _accountFrom.accountCurrency + ' * ' + rate + ')',
                transactionPostingDate: Common.getDate(postingDateTo, ''),
                transactionCRDR: 'Credit',
                transactionAccount: accountTo,
                transactionTypeId: typeTo,
                transactionRelatedTransactionId: relatedTransaction.relatedTransactionsId,
                transactionModule: TransactionModules.FX.Code,
                transactionModuleId: fxTransaction.fxId,
            }
            savedTrans = await this.transactionBusiness.addTransaction(transactionCR, dbTransaction);
            if(savedTrans) {
                await dbTransaction.commit();
            } else {
                await dbTransaction.rollback();
            }
        } catch (err) {
            console.log(err);
            await dbTransaction.rollback();
            throw new Exception('TRANS_ADD_FAIL');
        }
    }

    getDescription(bankFrom, accountFrom, bankTo, accountTo, amountFrom, amountTo, 
        currencyFrom, currencyTo, postingDate, rate){
        return `FX Transfer from ${bankFrom}(${accountFrom}) to ${bankTo}(${accountTo}) with ` 
               + `amount from ${amountFrom} ${currencyFrom} to amount ${amountTo} ${currencyTo} `
               + `on ${postingDate.substring(0, 10)} with rate ${rate}`;
    }

    async getFXTransactions({currency, againstCurrency, dateFrom, dateTo}) {
        const currencyObj = await CurrencyRepo.getCurrency(currency);
        if(!currencyObj) {
            throw new Exception('CURR_INVALID');
        }

        const againstCurrencyObj = await CurrencyRepo.getCurrency(againstCurrency);
        if(!againstCurrencyObj) {
            throw new Exception('CURR_INVALID');
        }
        // Construct Where Condition
        let whereQuery = {};

        whereQuery.fxCurrencyFrom = {
            [Op.in]: [currency, againstCurrency]
        }

        whereQuery.fxCurrencyTo = {
            [Op.in]: [currency, againstCurrency]
        }

        // Check Posting Date from and Posting Date To
        let _dateFrom = Common.getDate(dateFrom, '');
        let _dateTo = Common.getDate(dateTo, '');
        if( _dateFrom !== '' && _dateTo !== '') {
            whereQuery.fxPostingDateFrom = { [Op.between] : [_dateFrom, _dateTo] };
        } else {
            if(_dateFrom !== '') {
                whereQuery.fxPostingDateFrom = { [Op.gte] : _dateFrom };
            } else if(_dateTo !== '') {
                whereQuery.fxPostingDateFrom = { [Op.lte] : _dateTo };
            }
        }

        let fxTransactions = await FXTransactionRepo.getFXTransactions(whereQuery);
        let fxInCurrencyTotal = 0;
        let fxInAgainstCurrencyTotal = 0;
        let fxOutCurrencyTotal = 0;
        let fxOutAgainstCurrencyTotal = 0;
        fxTransactions = fxTransactions.map( trans => {
            //Calculate totals
            if(trans.fxCurrencyFrom === currency) {
                fxOutCurrencyTotal += Number(trans.fxAmountFrom);
                fxOutAgainstCurrencyTotal += Number(trans.fxAmountTo);
            } else {
                fxInCurrencyTotal += Number(trans.fxAmountTo);
                fxInAgainstCurrencyTotal += Number(trans.fxAmountFrom);
            }
            return {
                fxId: trans.fxId,
                fxAmountFrom: trans.fxAmountFrom,
                fxAmountTo: trans.fxAmountTo,
                fxPostingDateFrom: trans.fxPostingDateFrom,
                fxRate: trans.fxRate,
                fxCurrencyFrom: trans.fxCurrencyFrom,
                fxCurrencyFromDecimalPlace: 
                    (
                        trans.fxCurrencyFrom === currency? 
                        currencyObj.currencyDecimalPlace:
                        againstCurrencyObj.currencyDecimalPlace
                    ),
                fxCurrencyTo: trans.fxCurrencyTo,
                fxCurrencyToDecimalPlace: 
                (
                    trans.fxCurrencyTo === currency? 
                    currencyObj.currencyDecimalPlace:
                    againstCurrencyObj.currencyDecimalPlace
                ),
                fxPostingDateTo: trans.fxPostingDateTo,
                accountFrom: 
                    `${trans.accountFrom.accountNumber} (${trans.accountFrom.bank.bankCode})`,
                accountTo: 
                    `${trans.accountTo.accountNumber} (${trans.accountTo.bank.bankCode})`
            }
        });
        return {
            currency,
            againstCurrency,
            fxTransactions,
            fxInCurrencyTotal,
            fxInAgainstCurrencyTotal,
            fxOutCurrencyTotal,
            fxOutAgainstCurrencyTotal,
            fxInAverage: fxInCurrencyTotal===0?0:(fxInAgainstCurrencyTotal/fxInCurrencyTotal),
            fxOutAverage: fxOutCurrencyTotal===0?0:(fxOutAgainstCurrencyTotal/fxOutCurrencyTotal),
            currencyDecimalPlace: currencyObj.currencyDecimalPlace,
            againstCurrencyDecimalPlace: againstCurrencyObj.currencyDecimalPlace
        };
    }
}

module.exports = FXTransactionBusiness;