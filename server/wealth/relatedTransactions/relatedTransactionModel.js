const { Model } = require('sequelize');
const Sequelize = require('sequelize');
const sequelize = require('../../db/dbConnection').getSequelize();
const RelatedTypeModel = require('../relatedTypes/RelatedTypeModel');

class RelatedTransactionModel extends Model {}
RelatedTransactionModel.init({
  relatedTransactionsId: { type: Sequelize.BIGINT(20), primaryKey: true, autoIncrement: true },
  relatedTransactionType: Sequelize.STRING(3),
  relatedTransactionDesc: Sequelize.STRING(200),
}, {
  tableName: 'relatedtransactions',
  createdAt: false,
  updatedAt: false,
  sequelize
});

RelatedTransactionModel.belongsTo(RelatedTypeModel, {
  as: "relatedType",
  foreignKey: 'relatedTransactionType'
});

module.exports = RelatedTransactionModel;
