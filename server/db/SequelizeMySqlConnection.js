const Sequelize = require('sequelize');

class SequelizeMySqlConnection {
  constructor(dbName, dbUser, dbPassword, dbHost){
    this.sequelize = new Sequelize(dbName,dbUser,dbPassword, {
        host: dbHost,
        dialect: 'mysql'
    });
  }

  async connect() {
    await this.sequelize.authenticate();
  }

  async disconnect() {
    await this.sequelize.close();
  }

  getSequelize() {
    return this.sequelize;
  }
}

module.exports = SequelizeMySqlConnection;
