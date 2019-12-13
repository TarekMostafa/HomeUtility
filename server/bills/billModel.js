const Sequelize = require('sequelize');
const sequelize = require('../db/dbConnection').getSequelize();
const CurrencyModel = require('../currencies/CurrencyModel');

class BillModel extends Sequelize.Model {}
BillModel.init({
  billId: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  billFrequency: Sequelize.STRING(15),
  billName: Sequelize.STRING(100),
  billStartDate: Sequelize.DATEONLY,
  billStatus: Sequelize.ENUM('ACTIVE', 'CLOSED'),
  billCurrency: Sequelize.STRING(3),
  billDefaultAmount: Sequelize.DECIMAL(18, 3),
  billLastBillPaidDate: Sequelize.DATEONLY,
  billIsTransDetailRequired: Sequelize.BOOLEAN
}, {
  tableName: 'bills',
  createdAt: false,
  updatedAt: false,
  sequelize
});

class BillItemModel extends Sequelize.Model {}
BillItemModel.init({
  billItemId: { type: Sequelize.INTEGER, primaryKey: true },
  billItemName: Sequelize.STRING(15),
}, {
  tableName: 'billitems',
  createdAt: false,
  updatedAt: false,
  sequelize
});

BillModel.belongsTo(CurrencyModel, {
  as: "currency",
  foreignKey: 'billCurrency'
});

BillModel.hasMany(BillItemModel, {
  as: 'billItems', 
  onDelete: 'cascade',
  onUpdate: 'cascade',
  foreignKey: {name:'billId', allowNull: false}, 
  sourceKey: 'billId'
}); 

module.exports = { BillModel, BillItemModel };