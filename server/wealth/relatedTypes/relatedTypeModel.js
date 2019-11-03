const Sequelize = require('sequelize');
const sequelize = require('../../db/dbConnection').getSequelize();

class RelatedTypeModel extends Sequelize.Model {}
RelatedTypeModel.init({
  typeCode: { type: Sequelize.STRING(3), primaryKey: true },
  typeDescription: Sequelize.STRING(45),
}, {
  tableName: 'relatedtypes',
  createdAt: false,
  updatedAt: false,
  sequelize
});

module.exports = RelatedTypeModel;
