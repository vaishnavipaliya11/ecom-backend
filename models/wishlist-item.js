const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const WishlistItem = sequelize.define('wishlistItem', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  
});

module.exports = WishlistItem;