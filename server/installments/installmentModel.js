const Sequelize = require('sequelize');
const sequelize = require('../db/dbConnection').getSequelize();
const CurrencyModel = require('../currencies/currencyModel');

class InstallmentModel extends Sequelize.Model {}
InstallmentModel.init({
    instId: { type: Sequelize.INTEGER(11), primaryKey: true, autoIncrement: true},
    instName: Sequelize.STRING(50),
    instCurrency: Sequelize.STRING(3),
    instStartDate: Sequelize.DATEONLY,
    instEndDate: Sequelize.DATEONLY,
    instAmount: Sequelize.DECIMAL(18, 3),
    instStatus: Sequelize.ENUM('ACTIVE', 'CLOSED'),
    instEnteredAmount: Sequelize.DECIMAL(18, 3),
    instPaidAmount: Sequelize.DECIMAL(18, 3),
    instLastPaidUpdate: { type: Sequelize.DATE, allowNull: true},
    instNotes: Sequelize.STRING(200),
}, {
  tableName: 'installments',
  createdAt: false,
  updatedAt: false,
  sequelize
});

InstallmentModel.belongsTo(CurrencyModel, {
  as: "currency",
  foreignKey: 'instCurrency'
});

module.exports = InstallmentModel;
