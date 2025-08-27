const Sequelize = require('sequelize');
const sequelize = require('../db/dbConnection').getSequelize();
const InstallmentModel = require('./installmentModel');
const CurrencyModel = require('../currencies/currencyModel');

class InstallmentDetailModel extends Sequelize.Model {}
InstallmentDetailModel.init({
    instDetId: { type: Sequelize.INTEGER(11), primaryKey: true, autoIncrement: true},
    instId: Sequelize.INTEGER(11),
    instDetDate: Sequelize.DATEONLY,
    instDetAmount: Sequelize.DECIMAL(18, 3),
    instDetCurrency: Sequelize.STRING(3),
    instDetStatus: Sequelize.ENUM('UNPAID', 'PAID'),
    instDetCheckNumber: Sequelize.STRING(20),
    instDetPaidDate: { type: Sequelize.DATEONLY, allowNull: true},
    instDetNotes: Sequelize.STRING(200),
}, {
  tableName: 'installmentDetails',
  createdAt: false,
  updatedAt: false,
  sequelize
});

InstallmentDetailModel.belongsTo(InstallmentModel, {
    as: "installment",
    foreignKey: 'instId'
});

InstallmentDetailModel.belongsTo(CurrencyModel, {
  as: "currency",
  foreignKey: 'instDetCurrency'
});

module.exports = InstallmentDetailModel;
