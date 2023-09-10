const Sequelize = require('sequelize');

const sequelize = new Sequelize("store_7bcb", 'store_7bcb_user', 'H4m8i5z9N0S43AURCTRBF4i77MVWcSHo', {
  dialect: 'mysql',
  host: 'dpg-cjuq4dnhdsdc73e9m6g0-a',
  port: '5432',
});

module.exports = sequelize;
