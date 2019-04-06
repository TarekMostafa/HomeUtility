const { Model } = require('sequelize');
const Sequelize = require('sequelize');
const sequelize = require('../../db/dbConnection');

class BankModel extends Model {}
BankModel.init({
  bankCode: { type: Sequelize.STRING(3), primaryKey: true },
  bankName:  Sequelize.STRING(45),
}, {
  tableName: 'banks',
  createdAt: false,
  updatedAt: false,
  sequelize
});

module.exports = BankModel;
