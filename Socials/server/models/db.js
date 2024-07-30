// db.js
require('dotenv').config();
const { Sequelize } = require('sequelize');
const sequelize = new Sequelize('socials', 'root', 'hieu27112001@', {
  host: 'localhost',
  dialect: 'mysql',
});

module.exports = sequelize;
