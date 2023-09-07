const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const Address = sequelize.define('address', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  street: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  city: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  state: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  postalCode: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  country:{
    type:Sequelize.STRING,
    allowNull: false,
  },
  userId: { // Make sure you have this field in your Address model
    type: Sequelize.INTEGER, // or the appropriate data type for userId
    allowNull: false,
  },
  mobileNumber:{
    type:Sequelize.STRING,
    allowNull:true
  },
  fullName:{
    type:Sequelize.STRING,
    allowNull:false
  }
});

module.exports = Address;
