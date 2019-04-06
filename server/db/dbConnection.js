const Sequelize = require('sequelize');

const sequelize = new Sequelize('homeutilitydb','root','123456Aa', {
    host: 'localhost',
    dialect: 'mysql'
});

module.exports = sequelize;
