// models/User.js
const { DataTypes } = require('sequelize');
const sequelize = require('./db');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  phone: {
    type: DataTypes.STRING,
    unique: true,
    require:true,
  },
  password:{
    type: DataTypes.STRING,
    require:true
  },
  avatar: {
    type: DataTypes.STRING,
  },
  name: {
    type: DataTypes.STRING,
  },
  description: {
    type: DataTypes.TEXT,
  },
  city: {
    type: DataTypes.STRING,
  },
  school: {
    type: DataTypes.STRING,
  },
  work: {
    type: DataTypes.STRING,
  },
  website: {
    type: DataTypes.STRING,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

module.exports = User;
