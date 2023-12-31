const TransactionBusiness = require('./transactionBusiness');
const sequelize = require('../../db/dbConnection').getSequelize();
//const APIResponse = require('../../utilities/apiResponse');
const Exception = require('../../features/exception');

class SingleTransaction {
    constructor(){
        this.transactionBusiness = new TransactionBusiness();
    }

    async addSingleTransaction(transaction) {
        let dbTransaction;
        try{
            dbTransaction = await sequelize.transaction();
            const savedTrans = await this.transactionBusiness.addTransaction(transaction, dbTransaction);
            if(savedTrans) {
                await dbTransaction.commit();
            } else {
                await dbTransaction.rollback();
            }
        } catch (err) {
            await dbTransaction.rollback();
            throw new Exception('TRANS_ADD_FAIL');
        }
    }

    async deleteSingleTransaction(id) {
        let dbTransaction;
        try{
            dbTransaction = await sequelize.transaction();
            const savedTrans = await this.transactionBusiness.deleteTransaction(id, dbTransaction);
            if(savedTrans) {
                await dbTransaction.commit();
            } else {
                await dbTransaction.rollback();
            }
        } catch (err) {
            await dbTransaction.rollback();
            throw new Exception('TRANS_DELETE_FAIL');
        }
    }

    async editSingleTransaction(id, transaction) {
        let dbTransaction;
        try{
            dbTransaction = await sequelize.transaction();
            let savedTrans = await this.transactionBusiness.editTransaction(id, transaction, dbTransaction);
            if(savedTrans) {
                await dbTransaction.commit();
            } else {
                await dbTransaction.rollback();
            }
        } catch (err) {
            console.log(err);
            await dbTransaction.rollback();
            throw new Exception('TRANS_UPDATE_FAIL');
        }
    }
}

module.exports = SingleTransaction;