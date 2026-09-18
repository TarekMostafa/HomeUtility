const Sequelize = require('sequelize');
const sequelize = require('../db/dbConnection').getSequelize();

const CurrencyModel = require('../currencies/currencyModel');

class LabelModel extends Sequelize.Model {}
LabelModel.init({
    labelId: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
    labelNumber: Sequelize.TINYINT,
    labelText: Sequelize.STRING(20),
    labelCurrency: Sequelize.STRING(3),
    labelCRCount: Sequelize.BIGINT,
    labelDRCount: Sequelize.BIGINT,
    labelCRSum: Sequelize.BIGINT,
    labelDRSum: Sequelize.BIGINT,
}, {
  tableName: 'labels',
  createdAt: false,
  updatedAt: false,
  sequelize
});

LabelModel.belongsTo(CurrencyModel, {
  as: "currency",
  foreignKey: 'labelCurrency'
});

module.exports = LabelModel;