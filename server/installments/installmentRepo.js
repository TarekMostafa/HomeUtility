const InstallmentModel = require('./installmentModel');
const sequelize = require('../db/dbConnection').getSequelize();
const CurrencyModel = require('../currencies/currencyModel');

class InstallmentRepo {

    static async getInstallments (currency) {
        let query = {};
        if(currency) query.instCurrency = currency;
        return await InstallmentModel.findAll({
            include: [
                { model: CurrencyModel, as: 'currency', attributes: ['currencyDecimalPlace'] },
            ],
            where: query,
            order: [ ['instStartDate', 'ASC'] , ['instId', 'ASC'] ]
        });
    }

    static async getInstallment(id) {
        return await InstallmentModel.findByPk(id, {
            include: [
                { model: CurrencyModel, as: 'currency', attributes: ['currencyDecimalPlace'] },
            ]
        });
    }

    static async addInstallment(installment) {
        await InstallmentModel.build(installment).save();
    }

    static async updateEnteredAmount(installment, amount, dbTransaction) {
        await installment.update(
            {instEnteredAmount: sequelize.literal('instEnteredAmount+'+amount)},
            {transaction: dbTransaction});
    }

    static async updatePaidAmount(installment, amount, dbTransaction) {
        await installment.update(
            {instPaidAmount: sequelize.literal('instPaidAmount+'+amount),
            instLastPaidUpdate: sequelize.fn('NOW')},
            {transaction: dbTransaction});
    }
}

module.exports = InstallmentRepo;