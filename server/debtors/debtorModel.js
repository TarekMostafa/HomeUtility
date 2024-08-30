const Sequelize = require('sequelize');
const sequelize = require('../db/dbConnection').getSequelize();
const CurrencyModel = require('../currencies/currencyModel');

class DebtorModel extends Sequelize.Model {}
DebtorModel.init({
    debtId: { type: Sequelize.INTEGER(11), primaryKey: true, autoIncrement: true},
    debtName: Sequelize.STRING(50),
    debtCurrency: Sequelize.STRING(3),
    debtBalance: Sequelize.DECIMAL(18, 3),
    debtStatus: Sequelize.ENUM('ACTIVE', 'CLOSED'),
    debtNotes: Sequelize.STRING(200),
    debtLastBalanceUpdate: Sequelize.DATE,
    debtRelId: Sequelize.BIGINT(20),
    debtExemptionAmount: Sequelize.DECIMAL(18, 3),
    debtLastExemptionUpdate: Sequelize.DATE,
}, {
  tableName: 'debtors',
  createdAt: false,
  updatedAt: false,
  sequelize
});

DebtorModel.belongsTo(CurrencyModel, {
  as: "currency",
  foreignKey: 'debtCurrency'
});

module.exports = DebtorModel;
