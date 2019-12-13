const Sequelize = require('sequelize');
const sequelize = require('../db/dbConnection').getSequelize();
const CurrencyModel = require('../currencies/CurrencyModel');
const { BillModel, BillItemModel } = require('./billModel');

class BillTransactionModel extends Sequelize.Model {}
BillTransactionModel.init({
  transId: { type: Sequelize.BIGINT(20), primaryKey: true, autoIncrement: true },
  transAmount: Sequelize.DECIMAL(18, 3),
  transBillDate: Sequelize.DATEONLY,
  transNotes: Sequelize.STRING(255),
  transOutOfFreq: Sequelize.BOOLEAN,
  transAmountType: Sequelize.ENUM('Credit', 'Debit'),
  billId: Sequelize.INTEGER,
  transPostingDate: Sequelize.DATEONLY,
  transCurrency: Sequelize.STRING(3)
}, {
  tableName: 'billtransactions',
  createdAt: false,
  updatedAt: false,
  sequelize
});

class BillTransactionDetailModel extends Sequelize.Model {}
BillTransactionDetailModel.init({
  detId: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  detAmount: Sequelize.DECIMAL(18, 3),
  detQuantity: Sequelize.INTEGER,
  detAmountType: Sequelize.ENUM('Credit', 'Debit'),
  billItemId: Sequelize.INTEGER,
  transId: Sequelize.BIGINT(20)
}, {
  tableName: 'billtransactiondetails',
  createdAt: false,
  updatedAt: false,
  sequelize
});

BillTransactionModel.belongsTo(CurrencyModel, {
  as: "currency",
  foreignKey: 'transCurrency'
});

BillTransactionModel.belongsTo(BillModel, {
  as: "bill",
  foreignKey: 'billId'
});

BillTransactionDetailModel.belongsTo(BillItemModel, {
  as: "billItem",
  foreignKey: 'billItemId'
});

BillTransactionModel.hasMany(BillTransactionDetailModel, {
  as: 'billTransactionDetails', 
  onDelete: 'cascade',
  foreignKey: {name:'transId', allowNull: false}, 
  sourceKey: 'transId'
}); 

module.exports = { BillTransactionModel, BillTransactionDetailModel };