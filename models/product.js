const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Product = sequelize.define('product', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  title: Sequelize.STRING,
  price: {
    type: Sequelize.DOUBLE,
    allowNull: false
  },
  imageUrl: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  description: {
    type: Sequelize.STRING,
    allowNull: false
  },
  videoUrl:{
    type: Sequelize.STRING,
    allowNull:true
  },
  category:{
    type: Sequelize.STRING,
    allowNull:false,
    defaultValue: 'decor'
  },
  highlights:{
    type:Sequelize.STRING,
    allowNull:true
  },
  rating:{
    type:Sequelize.DOUBLE,
    allowNull:true
  }
});

module.exports = Product;
