const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const Wishlist = sequelize.define('wishlist', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  name: Sequelize.STRING
});

module.exports = Wishlist;
