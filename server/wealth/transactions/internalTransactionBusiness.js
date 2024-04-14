const TransactionBusiness = require('./transactionBusiness');
const RelatedTransactionRepo = require('../relatedTransactions/relatedTransactionRepo');
const sequelize = require('../../db/dbConnection').getSequelize();
const AccountRepo = require('../accounts/accountRepo');
const Exception = require('../../features/exception');
//const APIResponse = require('../../utilities/apiResponse');
const AppParametersRepo = require('../../appSettings/appParametersRepo');
const AppParametersConstants = require('../../appSettings/appParametersConstants');

class InternalTransaction {
    constructor(){
        this.transactionBusiness = new TransactionBusiness();
    }

    async getDefaultData() {
        const typeFrom = await AppParametersRepo.getAppParameterValue(
            AppParametersConstants.INTERNAL_TRANSACTION_TYPE_FROM); 
        const typeTo = await AppParametersRepo.getAppParameterValue(
            AppParametersConstants.INTERNAL_TRANSACTION_TYPE_TO);

        return {
            accountFrom: '',
            typeFrom,
            postingDate: '',
            amount:'',
            accountTo: '',
            typeTo,
        }
    }

    async addInternalTransaction({accountFrom, typeFrom, postingDate, 
        amount, accountTo, typeTo}) {
        // Validation
        // Account From must not be equal to Account To
        if(accountFrom === accountTo) {
            throw new Exception('TRANS_ACC1_NOT_EQUAL_ACC2');
        }
        // Account From Currency must be equal to Account To Currency
        let _accountFrom = await AccountRepo.getAccount(accountFrom);
        if(!_accountFrom){
            throw new Exception('ACC_INVALID');
        }
        let _accountTo = await AccountRepo.getAccount(accountTo);
        if(!_accountTo){
            throw new Exception('ACC_INVALID');
        }
        if(_accountFrom.accountCurrency !== _accountTo.accountCurrency) {
            throw new Exception('TRANS_CCY1_EQUAL_CCY2');
        }
        // Begin Transaction
        let dbTransaction;
        try{
            dbTransaction = await sequelize.transaction();
            // Related Transaction
            let relatedTransaction = {
            relatedTransactionType: 'IAT',
            relatedTransactionDesc: this.getDescription(_accountFrom.accountBankCode, 
                _accountFrom.accountNumber, _accountTo.accountBankCode, _accountTo.accountNumber,
                amount, _accountFrom.accountCurrency, postingDate)
            }
            relatedTransaction = await RelatedTransactionRepo.addRelatedTransaction(relatedTransaction, dbTransaction);
            // Debit Side
            let transactionDR = {
            transactionAmount: amount,
            transactionNarrative: _accountTo.bank.bankName + ' (' +
                _accountTo.accountNumber + ')',
            transactionPostingDate: Common.getDate(postingDate, ''),
            transactionCRDR: 'Debit',
            transactionAccount: accountFrom,
            transactionTypeId: typeFrom,
            transactionRelatedTransactionId: relatedTransaction.relatedTransactionsId
            }
            let savedTrans = await this.transactionBusiness.addTransaction(transactionDR, dbTransaction);
            if(!savedTrans){
                await dbTransaction.rollback();
                throw new Exception('TRANS_ADD_FAIL');
            }
            // Credit Side
            let transactionCR = {
            transactionAmount: amount,
            transactionNarrative: _accountFrom.bank.bankName + ' (' +
                _accountFrom.accountNumber + ')',
            transactionPostingDate: Common.getDate(postingDate, ''),
            transactionCRDR: 'Credit',
            transactionAccount: accountTo,
            transactionTypeId: typeTo,
            transactionRelatedTransactionId: relatedTransaction.relatedTransactionsId
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

    getDescription(bankFrom, accountFrom, bankTo, accountTo, amount, currency, postingDate) {
        return `Internal Transfer from ${bankFrom}(${accountFrom}) to ${bankTo}(${accountTo}) with ` 
               + `amount ${amount} ${currency} on ${postingDate.substring(0, 10)}`;
    }
}

module.exports = InternalTransaction;