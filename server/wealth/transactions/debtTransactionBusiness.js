const TransactionBusiness = require('./transactionBusiness');
const TransactionRepo = require('./transactionRepo');
const sequelize = require('../../db/dbConnection').getSequelize();
const DebtorRepo = require('../../debtors/debtorRepo');
const AppParametersRepo = require('../../appSettings/appParametersRepo');
const AppParametersConstants = require('../../appSettings/appParametersConstants');
const Exception = require('../../features/exception');

class DebtTransactionBusiness {
    constructor(){
        this.transactionBusiness = new TransactionBusiness();
    }

    async addDebtTransaction({account, postingDate, amount, crOrDr, debtorId, narrative}){
        let dbTransaction;
        try{
            dbTransaction = await sequelize.transaction();
            //Get debtor info
            const debtor = await DebtorRepo.getDebtor(debtorId);
            if(!debtor) throw new Exception('DEBT_NOT_EXIST');
            //Get transaction type id and adjust debt amount
            //debt amount is the negation value of transaction amount
            // if transaction value is 10 so debt amount will be -10
            let typeId = ''; 
            let debtAmount = 0;
            if(crOrDr === 'Credit') {
                debtAmount = amount * -1;
                typeId = await AppParametersRepo.getAppParameterValue(
                    AppParametersConstants.DEBT_TRANSACTION_CREDIT); 
            } else if(crOrDr === 'Debit'){
                debtAmount = amount;
                typeId = await AppParametersRepo.getAppParameterValue(
                    AppParametersConstants.DEBT_TRANSACTION_DEBIT); 
            }
            //add debt transaction
            const savedTrans = await this.transactionBusiness.addTransaction({
                transactionAmount: amount,
                transactionNarrative: narrative,
                transactionPostingDate: postingDate,
                transactionCRDR: crOrDr,
                transactionAccount: account,
                transactionTypeId: typeId,
                transactionRelatedTransactionId: debtor.debtRelId,
                transactionModule: 'DBT',
                transactionModuleId: debtorId,  
            }, dbTransaction);
            //update debtor balance 
            await DebtorRepo.updateDebtorBalance(debtorId, debtAmount, dbTransaction);

            await dbTransaction.commit();
        } catch (err) {
            console.log(err);
            await dbTransaction.rollback();
            throw new Exception('TRANS_DBT_ADD_FAIL');
        }
    }

    async updateDebtTransaction(id, {account, postingDate, amount, crOrDr, debtorId, narrative}){
        let dbTransaction;
        try{
            dbTransaction = await sequelize.transaction();
            //Get debtor info
            const debtor = await DebtorRepo.getDebtor(debtorId);
            if(!debtor) throw new Exception('DEBT_NOT_EXIST');
            //Adjust debt amount
            let debtAmount = 0;
            let typeId = ''; 
            if(crOrDr === 'Credit') {
                debtAmount = amount * -1;
                typeId = await AppParametersRepo.getAppParameterValue(
                    AppParametersConstants.DEBT_TRANSACTION_CREDIT);
            } else if(crOrDr === 'Debit'){
                debtAmount = amount;
                typeId = await AppParametersRepo.getAppParameterValue(
                    AppParametersConstants.DEBT_TRANSACTION_DEBIT);
            }
            // get debt transaction
            const accountTransaction = await TransactionRepo.getTransaction(id);
            if(!accountTransaction) throw new Exception('TRANS_NOT_EXIST');
            // edit debt transaction
            await this.transactionBusiness.editTransaction(id, {
                transactionAmount: amount,
                transactionNarrative: narrative,
                transactionPostingDate: postingDate,
                transactionCRDR: crOrDr,
                transactionAccount: account,
                transactionTypeId: typeId,
                transactionModuleId: debtorId,
                transactionRelatedTransactionId: debtor.debtRelId,
            }, dbTransaction);
            //update debtor balance 
            const oldAmount = this.transactionBusiness.evalTransactionAmount(
                accountTransaction.transactionAmount, 
                accountTransaction.transactionCRDR, 
                false
            );
            const newAmount = this.transactionBusiness.evalTransactionAmount(
                amount,
                crOrDr,
                true
            ); 
            if(debtorId === accountTransaction.transactionModuleId){
                await DebtorRepo.updateDebtorBalance(debtorId, oldAmount+newAmount, dbTransaction);
            } else {
                await DebtorRepo.updateDebtorBalance(debtorId, newAmount, dbTransaction);
                await DebtorRepo.updateDebtorBalance(accountTransaction.transactionModuleId, 
                    oldAmount, dbTransaction);
            }
            
            await dbTransaction.commit();
        } catch (err) {
            console.log(err);
            await dbTransaction.rollback();
            throw new Exception('TRANS_DBT_UPDATE_FAIL');
        }
    }

    async deleteDebtTransaction(id){
        let dbTransaction;
        try{
            dbTransaction = await sequelize.transaction();
            // get debt transaction
            const accountTransaction = await TransactionRepo.getTransaction(id);
            if(!accountTransaction) throw new Exception('TRANS_NOT_EXIST');
            // delete debt transaction
            await this.transactionBusiness.deleteTransaction(id, dbTransaction);
            //update debtor balance 
            let debtAmount = 0;
            if(accountTransaction.transactionCRDR === 'Credit') {
                debtAmount = accountTransaction.transactionAmount;
            } else if(accountTransaction.transactionCRDR === 'Debit'){
                debtAmount = accountTransaction.transactionAmount * -1;
            }
            await DebtorRepo.updateDebtorBalance(accountTransaction.transactionModuleId, 
                debtAmount, dbTransaction);

            await dbTransaction.commit();
        } catch (err) {
            console.log(err);
            await dbTransaction.rollback();
            throw new Exception('TRANS_DBT_DELETE_FAIL');
        }
    }

    async convertSingleTransactionToDebtTransaction(id, {debtorId}){
        let dbTransaction;
        try{
            dbTransaction = await sequelize.transaction();
            //Get debtor info
            const debtor = await DebtorRepo.getDebtor(debtorId);
            if(!debtor) throw new Exception('DEBT_NOT_EXIST');
            // get single transaction
            const accountTransaction = await TransactionRepo.getTransaction(id);
            if(!accountTransaction) throw new Exception('TRANS_NOT_EXIST');
            //adjust amount
            let debtAmount = 0;
            if(accountTransaction.transactionCRDR === 'Credit') {
                debtAmount = accountTransaction.transactionAmount * -1;
            } else if(accountTransaction.transactionCRDR === 'Debit'){
                debtAmount = accountTransaction.transactionAmount;
            }
            //update transaction
            const savedTrans = await this.transactionBusiness.editTransaction(accountTransaction.transactionId, {
                transactionAmount: accountTransaction.transactionAmount,
                transactionNarrative: accountTransaction.transactionNarrative,
                transactionPostingDate: accountTransaction.transactionPostingDate,
                transactionCRDR: accountTransaction.transactionCRDR,
                transactionAccount: accountTransaction.transactionAccount,
                transactionTypeId: accountTransaction.transactionTypeId,
                transactionModule: 'DBT',
                transactionRelatedTransactionId: debtor.debtRelId,
                transactionModuleId: debtorId,  
            }, dbTransaction);
            //update debtor balance 
            await DebtorRepo.updateDebtorBalance(debtorId, debtAmount, dbTransaction);

            await dbTransaction.commit();
        } catch (err) {
            console.log(err);
            await dbTransaction.rollback();
            throw new Exception('TRANS_DBT_CONVERT_FAIL');
        }
    }

    async linkSingleTransactionToDebtor(id, {debtorId}){
        let dbTransaction;
        try{
            dbTransaction = await sequelize.transaction();
            //Get debtor info
            const debtor = await DebtorRepo.getDebtor(debtorId);
            if(!debtor) throw new Exception('DEBT_NOT_EXIST');
            // get single transaction
            const accountTransaction = await TransactionRepo.getTransaction(id);
            if(!accountTransaction) throw new Exception('TRANS_NOT_EXIST');
            //adjust amount
            let debtAmount = 0;
            if(accountTransaction.transactionCRDR === 'Credit') {
                debtAmount = accountTransaction.transactionAmount * -1;
            } else if(accountTransaction.transactionCRDR === 'Debit'){
                debtAmount = accountTransaction.transactionAmount;
            }
            //update transaction
            const savedTrans = await this.transactionBusiness.editTransaction(accountTransaction.transactionId, {
                transactionAmount: accountTransaction.transactionAmount,
                transactionNarrative: accountTransaction.transactionNarrative,
                transactionPostingDate: accountTransaction.transactionPostingDate,
                transactionCRDR: accountTransaction.transactionCRDR,
                transactionAccount: accountTransaction.transactionAccount,
                transactionTypeId: accountTransaction.transactionTypeId,
                transactionModule: accountTransaction.transactionModule,
                transactionRelatedTransactionId: debtor.debtRelId,
                //transactionModuleId: debtorId,  
            }, dbTransaction);
            //update debtor balance 
            await DebtorRepo.updateDebtorBalance(debtorId, debtAmount, dbTransaction);

            await dbTransaction.commit();
        } catch (err) {
            console.log(err);
            await dbTransaction.rollback();
            throw new Exception('TRANS_DBT_LINK_FAIL');
        }
    }
}

module.exports = DebtTransactionBusiness;