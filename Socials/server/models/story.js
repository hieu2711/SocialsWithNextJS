// models/Story.js
const { DataTypes } = require('sequelize');
const sequelize = require('./db');
const User = require('./user');

const Story = sequelize.define('Story', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  expiresAt: {
    type: DataTypes.DATE,
  },
  img: {
    type: DataTypes.STRING,
  },
});

Story.belongsTo(User, { foreignKey: 'userId', onDelete: 'CASCADE' });
User.hasOne(Story, { foreignKey: 'userId' });

module.exports = Story;
