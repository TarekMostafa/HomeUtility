const sequelize = require('../../db/dbConnection').getSequelize();
const TransactionBusiness = require('./transactionBusiness');
const RelatedTransactionRepo = require('../relatedTransactions/relatedTransactionRepo');
const FXTransactionRepo = require('./fxTransactionRepo');
const AccountRepo = require('../accounts/accountRepo');
const Exception = require('../../features/exception');
const AppParametersRepo = require('../../appSettings/appParametersRepo');
const AppParametersConstants = require('../../appSettings/appParametersConstants');
const Common = require('../../utilities/common');

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

    async addFXTransaction({accountFrom, accountTo, typeFrom, typeTo, postingDate, 
        rate, amountFrom, amountTo}) {
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
                    postingDate, rate)
            }
            relatedTransaction = await RelatedTransactionRepo.addRelatedTransaction(relatedTransaction, dbTransaction);
            // Add FX Transaction
            let fxTransaction = {
                fxRelTransId: relatedTransaction.relatedTransactionsId,
                fxAmountFrom: amountFrom,
                fxAmountTo: amountTo,
                fxPostingDate: Common.getDate(postingDate, ''),
                fxRate: rate,
                fxAccountFrom: accountFrom,
                fxAccountTo: accountTo,
                fxCurrencyFrom: _accountFrom.accountCurrency,
                fxCurrencyTo: _accountTo.accountCurrency
            }
            fxTransaction = await FXTransactionRepo.addTransaction(fxTransaction, dbTransaction);
            // Debit Side
            let transactionDR = {
                transactionAmount: amountFrom,
                transactionNarrative: 'Forex ('+ amountTo + ' ' +
                    _accountTo.accountCurrency + ' / ' + rate + ')',
                transactionPostingDate: Common.getDate(postingDate, ''),
                transactionCRDR: 'Debit',
                transactionAccount: accountFrom,
                transactionTypeId: typeFrom,
                transactionRelatedTransactionId: relatedTransaction.relatedTransactionsId,
                transactionModule: 'FX',
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
                transactionPostingDate: Common.getDate(postingDate, ''),
                transactionCRDR: 'Credit',
                transactionAccount: accountTo,
                transactionTypeId: typeTo,
                transactionRelatedTransactionId: relatedTransaction.relatedTransactionsId,
                transactionModule: 'FX',
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
}

module.exports = FXTransactionBusiness;