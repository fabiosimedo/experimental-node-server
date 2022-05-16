const Sequelize = require('sequelize');
const connection = require('./database');

const Delete = delete(async () => {
  await Sequelize.drop();
  console.log("All tables dropped!");
})

module.exports = Delete