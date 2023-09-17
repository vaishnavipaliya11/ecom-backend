const Sequelize = require("sequelize");
const dotenv= require('dotenv').config();

const username= process.env.USERNAMEOFDB
const dbname=process.env.DBNAME
const password= process.env.PASSWORD
const host= process.env.HOST
console.log(username, "username");
const sequelize = new Sequelize(dbname, username, password, {
  dialect: "mysql",
  host: host,
  dialectOptions: {
    ssl: {
      require: true, // Set this to true to require SSL/TLS
      rejectUnauthorized: false, // You might need to adjust this based on your SSL certificate configuration
    },
  },
});

module.exports = sequelize;
