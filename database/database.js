const Sequelize = require('sequelize');

const connection = new Sequelize('nodeproject', 'root', '', {
  host: 'localhost',
  dialect: 'mysql'
});

module.exports = connection;
