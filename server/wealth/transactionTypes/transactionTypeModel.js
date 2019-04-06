const { Model } = require('sequelize');
const Sequelize = require('sequelize');
const sequelize = require('../../db/dbConnection');

class TransactionTypeModel extends Model {}
TransactionTypeModel.init({
  typeId: { type: Sequelize.INTEGER, primaryKey: true },
  typeName: Sequelize.STRING(45),
  typeCRDR: Sequelize.ENUM('Credit', 'Debit'),
}, {
  tableName: 'transactiontypes',
  createdAt: false,
  updatedAt: false,
  sequelize
});

module.exports = TransactionTypeModel;
