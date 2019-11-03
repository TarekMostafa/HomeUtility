const Transaction = require('./transaction');
const sequelize = require('../../db/dbConnection').getSequelize();
const APIResponse = require('../../utilities/apiResponse');

class SingleTransaction {
    constructor(){
        this.transaction = new Transaction();
    }

    async addSingleTransaction(transaction) {
        let dbTransaction;
        try{
            dbTransaction = await sequelize.transaction();
            const result = await this.transaction.addTransaction(transaction, dbTransaction);
            if(result.success) {
                await dbTransaction.commit();
            } else {
                await dbTransaction.rollback();
            }
            return result;
        } catch (err) {
            await dbTransaction.rollback();
            return APIResponse.getAPIResponse(false, null, '031');
        }
    }

    async deleteSingleTransaction(id) {
        let dbTransaction;
        try{
            dbTransaction = await sequelize.transaction();
            const result = await this.transaction.deleteTransaction(id, dbTransaction);
            if(result.success) {
                await dbTransaction.commit();
            } else {
                await dbTransaction.rollback();
            }
            return result;
        } catch (err) {
            await dbTransaction.rollback();
            return APIResponse.getAPIResponse(false, null, '038');
        }
    }

    async editSingleTransaction(id, transaction) {
        let dbTransaction;
        try{
            dbTransaction = await sequelize.transaction();
            let result = await this.transaction.editTransaction(id, transaction, dbTransaction);
            if(result.success) {
                await dbTransaction.commit();
            } else {
                await dbTransaction.rollback();
            }
            return result;
        } catch (err) {
            await dbTransaction.rollback();
            return APIResponse.getAPIResponse(false, null, '036');
        }
    }
}

module.exports = SingleTransaction;