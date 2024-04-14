const Sequelize = require('sequelize');
const sequelize = require('../../db/dbConnection').getSequelize();
const FXTransactionModel = require('./fxtransactionModel');

class FXTransactionRepo {
    static async addTransaction(fxTransaction, dbTransaction) {
        return await FXTransactionModel.build(fxTransaction).save({transaction: dbTransaction});
    }
}

module.exports = FXTransactionRepo;