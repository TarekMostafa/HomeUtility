const Sequelize = require('sequelize');
const sequelize = require('../../db/dbConnection').getSequelize();
const FXTransactionModel = require('./fxtransactionModel');
const AccountModel = require('../accounts/accountModel');
const BankModel = require('../banks/bankModel');

class FXTransactionRepo {
    static async addTransaction(fxTransaction, dbTransaction) {
        return await FXTransactionModel.build(fxTransaction).save({transaction: dbTransaction});
    }

    static async getFXTransactions(whereQuery) {
        return await FXTransactionModel.findAll({
            attributes: ['fxId', 'fxAmountFrom', 'fxAmountTo', 'fxPostingDateFrom',
                'fxRate', 'fxCurrencyFrom', 'fxCurrencyTo', 'fxPostingDateTo'
            ],
            include: [
                { 
                    model: AccountModel, as: 'accountFrom', attributes: ['accountNumber'],
                    include: [{
                        model: BankModel, as: 'bank', attributes: ['bankCode']
                    }]
                },
                { 
                    model: AccountModel, as: 'accountTo', attributes: ['accountNumber'],
                    include: [{
                        model: BankModel, as: 'bank', attributes: ['bankCode']
                    }]
                }
            ],
            where: whereQuery,
            order: [ ['fxPostingDateFrom', 'DESC'] , ['fxId', 'DESC'] ]
        });
    }
}

module.exports = FXTransactionRepo;