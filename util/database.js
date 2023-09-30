const Sequelize = require("sequelize");
const dotenv = require("dotenv").config();

const username = process.env.USERNAMEOFDB;
const dbname = process.env.DBNAME;
const password = process.env.PASSWORD;
const host = process.env.HOST;
const sequelize = new Sequelize(dbname, username, password, {
  dialect: "mysql",
  host: host,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

module.exports = sequelize;
