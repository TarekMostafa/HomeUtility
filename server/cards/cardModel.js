const Sequelize = require('sequelize');
const sequelize = require('../db/dbConnection').getSequelize();
const CurrencyModel = require('../currencies/currencyModel');
const BankModel = require('../wealth/banks/bankModel');

class CardModel extends Sequelize.Model {}
CardModel.init({
    cardId: { type: Sequelize.INTEGER(11), primaryKey: true, autoIncrement: true},
    cardNumber: Sequelize.STRING(20),
    cardLimit: Sequelize.DECIMAL(18, 3),
    cardBalance: Sequelize.DECIMAL(18, 3),
    cardStatus: Sequelize.ENUM('ACTIVE', 'CLOSED'),
    cardBank: Sequelize.STRING(3),
    cardCurrency: Sequelize.STRING(3),
    cardStartDate: Sequelize.DATEONLY,
    cardExpiryDate: Sequelize.DATEONLY,
    cardLastBalanceUpdate: Sequelize.DATE
}, {
  tableName: 'cards',
  createdAt: false,
  updatedAt: false,
  sequelize
});

CardModel.belongsTo(BankModel, {
    as: "bank",
    foreignKey: 'cardBank'
});

CardModel.belongsTo(CurrencyModel, {
  as: "currency",
  foreignKey: 'cardCurrency'
});

module.exports = CardModel;
