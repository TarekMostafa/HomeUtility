const Sequelize = require('sequelize');
const sequelize = require('../db/dbConnection').getSequelize();

class AppParametersModel extends Sequelize.Model {}
AppParametersModel.init({
  paramName: { type: Sequelize.STRING(45), primaryKey: true },
  paramValue: Sequelize.STRING(45),
  paramDescription: Sequelize.STRING(45)
}, {
  tableName: 'appParameters',
  createdAt: false,
  updatedAt: false,
  sequelize
});

module.exports = AppParametersModel;
