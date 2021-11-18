const Sequelize = require('sequelize');
const sequelize = require('../../db/dbConnection').getSequelize();
const CurrencyModel = require('../../currencies/currencyModel');
const CardModel = require('../cardModel');

class CardInstallmentModel extends Sequelize.Model {}
CardInstallmentModel.init({
    cInstId: { type: Sequelize.BIGINT(20), primaryKey: true, autoIncrement: true},
    cardId: Sequelize.INTEGER(11),
    cInstCurrency: Sequelize.STRING(3),
    cInstItemDesc: Sequelize.STRING(200),
    cInstPurchaseDate: Sequelize.DATEONLY,
    cInstFirstInstDate: Sequelize.DATEONLY,
    cInstNoOfInst: Sequelize.SMALLINT,
    cInstPrice: Sequelize.DECIMAL(18, 3),
    cInstNoOfPostedInst: Sequelize.SMALLINT,
    cInstPosted: Sequelize.DECIMAL(18, 3),
    cInstRelTransId: Sequelize.BIGINT(20),
    cInstStatus: Sequelize.ENUM('NEW', 'ACTIVE', 'FINISHED')
}, {
  tableName: 'cardinstallments',
  createdAt: false,
  updatedAt: false,
  sequelize
});

CardInstallmentModel.belongsTo(CardModel, {
  as: "card",
  foreignKey: 'cardId'
});

CardInstallmentModel.belongsTo(CurrencyModel, {
    as: "currency",
    foreignKey: 'cInstCurrency'
  });

module.exports = CardInstallmentModel;
