const Sequelize = require('sequelize');
const sequelize = require('../../db/dbConnection').getSequelize();
const CurrencyModel = require('../../currencies/currencyModel');
const CardModel = require('../cardModel');

class CardTransactionModel extends Sequelize.Model {}
CardTransactionModel.init({
    cardTransId: { type: Sequelize.BIGINT(20), primaryKey: true, autoIncrement: true},
    cardId: Sequelize.INTEGER(11),
    cardTransAmount: Sequelize.DECIMAL(18, 3),
    cardTransCurrency: Sequelize.STRING(3),
    cardTransDate: Sequelize.DATEONLY,
    cardTransDesc: Sequelize.STRING(150),
    cardTransBillAmount: Sequelize.DECIMAL(18, 3),
    cardTransBillDate:  Sequelize.DATEONLY,
    cardTransIsInstallment: Sequelize.BOOLEAN,
    cardTransAccountTransId: Sequelize.BIGINT(20),
    cardTransInstallmentId: Sequelize.BIGINT(20),
    cardTransIsPaid: Sequelize.BOOLEAN,
    cardTransPayForOthers: Sequelize.BOOLEAN,
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

CardTransactionModel.belongsTo(CardModel, {
  as: "card",
  foreignKey: 'cardId'
});

module.exports = CardTransactionModel;
