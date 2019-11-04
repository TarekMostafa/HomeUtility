const Transaction = require('./transaction');
const RelatedTransactionRepo = require('../relatedTransactions/relatedTransactionRepo');
const sequelize = require('../../db/dbConnection').getSequelize();
const AccountRepo = require('../accounts/accountRepo');
const APIResponse = require('../../utilities/apiResponse');

class InternalTransaction {
    constructor(){
        this.transaction = new Transaction();
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
            relatedTransactionDesc: this.getDescription(accountFrom.accountBankCode, 
                accountFrom.accountNumber, accountTo.accountBankCode, accountTo.accountNumber,
                internalTransaction.amount, accountFrom.accountCurrency, internalTransaction.postingDate)
            }
            relatedTransaction = await RelatedTransactionRepo.addRelatedTransaction(relatedTransaction, dbTransaction);
            // Debit Side
            let transactionDR = {
            transactionAmount: internalTransaction.amount,
            transactionNarrative: accountTo.bank.bankName + ' (' +
                accountTo.accountNumber + ')',
            transactionPostingDate: internalTransaction.postingDate,
            transactionCRDR: 'Debit',
            transactionAccount: internalTransaction.accountFrom,
            transactionTypeId: internalTransaction.typeFrom,
            transactionRelatedTransactionId: relatedTransaction.relatedTransactionsId
            }
            let result = await this.transaction.addTransaction(transactionDR, dbTransaction);
            if(!result.success){
            await dbTransaction.rollback();
            return result;
            }
            // Credit Side
            let transactionCR = {
            transactionAmount: internalTransaction.amount,
            transactionNarrative: accountFrom.bank.bankName + ' (' +
                accountFrom.accountNumber + ')',
            transactionPostingDate: internalTransaction.postingDate,
            transactionCRDR: 'Credit',
            transactionAccount: internalTransaction.accountTo,
            transactionTypeId: internalTransaction.typeTo,
            transactionRelatedTransactionId: relatedTransaction.relatedTransactionsId
            }
            result = await this.transaction.addTransaction(transactionCR, dbTransaction);
            if(result.success) {
            await dbTransaction.commit();
            } else {
            await dbTransaction.rollback();
            }
            return result;
        } catch (err) {
            console.log(err);
            await dbTransaction.rollback();
            return APIResponse.getAPIResponse(false, null, '031');
        }
    }

    getDescription(bankFrom, accountFrom, bankTo, accountTo, amount, currency, postingDate) {
        return `Internal Transfer from ${bankFrom}(${accountFrom}) to ${bankTo}(${accountTo}) with ` 
               + `amount ${amount} ${currency} on ${postingDate.substring(0, 10)}`;
    }
}

module.exports = InternalTransaction;