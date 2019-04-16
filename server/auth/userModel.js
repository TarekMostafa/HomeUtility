const { Model } = require('sequelize');
const Sequelize = require('sequelize');
const sequelize = require('../db/dbConnection').getSequelize();

class UserModel extends Model {}
UserModel.init({
  userId: { type: Sequelize.INTEGER, primaryKey: true },
  userName: Sequelize.STRING(20),
  userPassword: Sequelize.STRING(64),
  userActive: Sequelize.BOOLEAN,
  userAttempt: Sequelize.INTEGER
}, {
  tableName: 'users',
  createdAt: false,
  updatedAt: false,
  sequelize
});

module.exports = UserModel;