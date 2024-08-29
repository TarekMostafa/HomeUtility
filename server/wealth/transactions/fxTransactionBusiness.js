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
const TransactionRepo = require('./transactionRepo');
const { Modules } = require('./transactionModules');
const AmountHelper = require('../../helper/AmountHelper');

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
        let fxCurrencyFromDecimalPlace = 0;
        let fxCurrencyToDecimalPlace = 0;

        fxTransactions = fxTransactions.map( trans => {
            //Calculate totals
            if(trans.fxCurrencyFrom === currency) {
                fxOutCurrencyTotal += Number(trans.fxAmountFrom);
                fxOutAgainstCurrencyTotal += Number(trans.fxAmountTo);
                fxCurrencyFromDecimalPlace = currencyObj.currencyDecimalPlace;
                fxCurrencyToDecimalPlace = againstCurrencyObj.currencyDecimalPlace;
            } else {
                fxInCurrencyTotal += Number(trans.fxAmountTo);
                fxInAgainstCurrencyTotal += Number(trans.fxAmountFrom);
                fxCurrencyFromDecimalPlace = againstCurrencyObj.currencyDecimalPlace;
                fxCurrencyToDecimalPlace = currencyObj.currencyDecimalPlace;
            }

            return {
                fxId: trans.fxId,
                fxAmountFrom: trans.fxAmountFrom,
                fxAmountFromFormatted: 
                    AmountHelper.formatAmount(trans.fxAmountFrom, fxCurrencyFromDecimalPlace),
                fxAmountTo: trans.fxAmountTo,
                fxAmountToFormatted: 
                    AmountHelper.formatAmount(trans.fxAmountTo, fxCurrencyToDecimalPlace),
                fxPostingDateFrom: trans.fxPostingDateFrom,
                fxRate: trans.fxRate,
                fxCurrencyFrom: trans.fxCurrencyFrom,
                // fxCurrencyFromDecimalPlace: 
                //     (
                //         trans.fxCurrencyFrom === currency? 
                //         currencyObj.currencyDecimalPlace:
                //         againstCurrencyObj.currencyDecimalPlace
                //     ),
                fxCurrencyFromDecimalPlace,
                fxCurrencyTo: trans.fxCurrencyTo,
                // fxCurrencyToDecimalPlace: 
                // (
                //     trans.fxCurrencyTo === currency? 
                //     currencyObj.currencyDecimalPlace:
                //     againstCurrencyObj.currencyDecimalPlace
                // ),
                fxCurrencyToDecimalPlace,
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
            fxInCurrencyTotal: 
                AmountHelper.formatAmount(fxInCurrencyTotal, currencyObj.currencyDecimalPlace),
            fxInAgainstCurrencyTotal: 
                AmountHelper.formatAmount(fxInAgainstCurrencyTotal, againstCurrencyObj.currencyDecimalPlace),
            fxOutCurrencyTotal: 
                AmountHelper.formatAmount(fxOutCurrencyTotal, currencyObj.currencyDecimalPlace),
            fxOutAgainstCurrencyTotal:
                AmountHelper.formatAmount(fxOutAgainstCurrencyTotal, againstCurrencyObj.currencyDecimalPlace),
            fxInAverage: fxInCurrencyTotal===0?0:(fxInAgainstCurrencyTotal/fxInCurrencyTotal),
            fxOutAverage: fxOutCurrencyTotal===0?0:(fxOutAgainstCurrencyTotal/fxOutCurrencyTotal),
            //currencyDecimalPlace: currencyObj.currencyDecimalPlace,
            //againstCurrencyDecimalPlace: againstCurrencyObj.currencyDecimalPlace
        };
    }

    async getFXTransaction(id) {
        const transaction = await TransactionRepo.getTransaction(id);
        //Check valid transaction Id
        if(!transaction) {
            throw new Exception('TRANS_INVALID');
        }
        //Check if it is FX transaction with FX Id
        if(transaction.transactionModule !== Modules.FX.Code ||
            !transaction.transactionModuleId
        ) {
            throw new Exception('TRANS_FX_INVALID');
        }
        //Get FX transaction record
        const fxTransaction = await FXTransactionRepo.getFXTransaction(transaction.transactionModuleId);
        if(!fxTransaction) {
            throw new Exception('TRANS_FX_INVALID');
        }

        //Get Opposite FX transaction for FX
        let whereQuery = {
            transactionId: {
                [Op.ne]: transaction.transactionId
            },
            transactionCRDR: {
                [Op.ne]: transaction.transactionCRDR
            },
            transactionModule : Modules.FX.Code,
            transactionModuleId: transaction.transactionModuleId,
            transactionRelatedTransactionId: transaction.transactionRelatedTransactionId
        }
        const oppositeTransaction = await TransactionRepo.getOppositeTransaction(whereQuery);
        if(!oppositeTransaction) {
            throw new Exception('TRANS_FX_INVALID');
        }
        
        //Debit means from
        //Credit means to
        let retFxTransaction = {};
        if(transaction.transactionCRDR === "Credit") {
            retFxTransaction.fxFromId = oppositeTransaction.transactionId;
            retFxTransaction.fxFromAccountId = oppositeTransaction.transactionAccount;
            retFxTransaction.fxFromTypeId = oppositeTransaction.transactionTypeId;
            retFxTransaction.fxFromPostingDate = oppositeTransaction.transactionPostingDate;
            retFxTransaction.fxFromAmount = oppositeTransaction.transactionAmount;
            retFxTransaction.fxFromCurrency = oppositeTransaction.account.accountCurrency;
            retFxTransaction.fxFromCurrencyDecimal = oppositeTransaction.account.currency.currencyDecimalPlace;

            retFxTransaction.fxToId = transaction.transactionId;
            retFxTransaction.fxToAccountId = transaction.transactionAccount;
            retFxTransaction.fxToTypeId = transaction.transactionTypeId;
            retFxTransaction.fxToPostingDate = transaction.transactionPostingDate;
            retFxTransaction.fxToAmount = transaction.transactionAmount;
            retFxTransaction.fxToCurrency = transaction.account.accountCurrency;
            retFxTransaction.fxToCurrencyDecimal = transaction.account.currency.currencyDecimalPlace;
        } else {
            retFxTransaction.fxFromId = transaction.transactionId;
            retFxTransaction.fxFromAccountId = transaction.transactionAccount;
            retFxTransaction.fxFromTypeId = transaction.transactionTypeId;
            retFxTransaction.fxFromPostingDate = transaction.transactionPostingDate;
            retFxTransaction.fxFromAmount = transaction.transactionAmount;
            retFxTransaction.fxFromCurrency = transaction.account.accountCurrency;
            retFxTransaction.fxFromCurrencyDecimal = transaction.account.currency.currencyDecimalPlace;

            retFxTransaction.fxToId = oppositeTransaction.transactionId;
            retFxTransaction.fxToAccountId = oppositeTransaction.transactionAccount;
            retFxTransaction.fxToTypeId = oppositeTransaction.transactionTypeId;
            retFxTransaction.fxToPostingDate = oppositeTransaction.transactionPostingDate;
            retFxTransaction.fxToAmount = oppositeTransaction.transactionAmount;
            retFxTransaction.fxToCurrency = oppositeTransaction.account.accountCurrency;
            retFxTransaction.fxToCurrencyDecimal = oppositeTransaction.account.currency.currencyDecimalPlace;
        }

        retFxTransaction.fxRate = fxTransaction.fxRate;
        retFxTransaction.fxId = fxTransaction.fxId;

        return retFxTransaction;
    }

    async deleteFXTransaction(fxId, {fromId, toId}) {
        //Check FX transaction
        const fxTransaction = await FXTransactionRepo.getFXTransaction(fxId);
        if(!fxTransaction) {
            throw new Exception('TRANS_FX_INVALID');
        }
        //Check valid from transaction Id
        let transactionFrom = await TransactionRepo.getTransaction(fromId);
        if(!transactionFrom) {
            throw new Exception('TRANS_INVALID');
        }
        //Check valid to transaction Id
        let transactionTo = await TransactionRepo.getTransaction(toId);
        if(!transactionTo) {
            throw new Exception('TRANS_INVALID');
        }
        //Check related transaction
        let relatedTransaction = await RelatedTransactionRepo.getRelatedTransaction(fxTransaction.fxRelTransId);
        if(!relatedTransaction) {
            throw new Exception('TRANS_INVALID');
        }

        // Begin Transaction
        let dbTransaction;
        try{
            dbTransaction = await sequelize.transaction();
            await this.transactionBusiness.deleteTransaction(transactionFrom.transactionId, dbTransaction);
            await this.transactionBusiness.deleteTransaction(transactionTo.transactionId, dbTransaction);
            await FXTransactionRepo.deleteFXTransaction(fxTransaction, dbTransaction);
            await RelatedTransactionRepo.deleteRelatedTransaction(relatedTransaction, dbTransaction);
            await dbTransaction.commit();
        } catch (err) {
            console.log(err);
            await dbTransaction.rollback();
            throw new Exception('TRANS_DELETE_FAIL');
        }    
    }
}

module.exports = FXTransactionBusiness;