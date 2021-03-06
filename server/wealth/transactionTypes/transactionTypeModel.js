const Sequelize = require('sequelize');
const sequelize = require('../../db/dbConnection').getSequelize();

class TransactionTypeModel extends Sequelize.Model {}
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
