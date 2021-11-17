const Sequelize = require('sequelize');
const sequelize = require('../../db/dbConnection').getSequelize();
const CurrencyModel = require('../../currencies/currencyModel');

class CardTransactionModel extends Sequelize.Model {}
CardTransactionModel.init({
    cardTransId: { type: Sequelize.BIGINT(20), primaryKey: true, autoIncrement: true},
    cardId: Sequelize.INTEGER(11),
    cardTransAmount: Sequelize.DECIMAL(18, 3),
    cardTransCurrency: Sequelize.STRING(3),
    cardTransDate: Sequelize.DATEONLY,
    cardTransDesc: Sequelize.STRING(150),
    cardTransBillDate:  Sequelize.DATEONLY,
    cardTransIsInstallment: Sequelize.BOOLEAN,
    cardTransAccountTransId: Sequelize.BIGINT(20)
}, {
  tableName: 'cardtransactions',
  createdAt: false,
  updatedAt: false,
  sequelize
});

CardTransactionModel.belongsTo(CurrencyModel, {
  as: "currency",
  foreignKey: 'cardTransCurrency'
});

module.exports = CardTransactionModel;
