const InstallmentDetailModel = require('./installmentDetailModel');
const sequelize = require('../db/dbConnection').getSequelize();
const InstallmentModel = require('./installmentModel');
const CurrencyModel = require('../currencies/currencyModel');

class InstallmentDetailRepo {

    static async getInstallmentDetails(instId) {
        let query = {};
        query.instId = instId;
        return await InstallmentDetailModel.findAll({
            include: [
                { model: CurrencyModel, as: 'currency', attributes: ['currencyDecimalPlace'] },
            ],
            where: query,
            order: [ ['instDetDate', 'ASC'] , ['instDetId', 'ASC'] ]
        });
    }

    static async getInstallmentDetail(instDetId) {
        return await InstallmentDetailModel.findByPk(instDetId, {
            include: [
                { model: CurrencyModel, as: 'currency', attributes: ['currencyDecimalPlace'] },
            ]
        });
    }

    static async addInstallmentDetail(installmentDetail, dbTransaction) {
        await InstallmentDetailModel.build(installmentDetail).save({transaction: dbTransaction});
    }
}

module.exports = InstallmentDetailRepo;
