const Sequelize = require('sequelize');

const sequelize = new Sequelize('e-commerce', 'root', 'abcd', {
  dialect: 'mysql',
  host: 'localhost'
});

module.exports = sequelize;
