// models/Block.js
const { DataTypes } = require('sequelize');
const sequelize = require('./db');
const User = require('./user');

const Block = sequelize.define('Block', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

Block.belongsTo(User, { as: 'blocker', foreignKey: 'blockerId', onDelete: 'CASCADE' });
Block.belongsTo(User, { as: 'blocked', foreignKey: 'blockedId', onDelete: 'CASCADE' });

User.hasMany(Block, { as: 'blocks', foreignKey: 'blockerId' });
User.hasMany(Block, { as: 'blockedBy', foreignKey: 'blockedId' });

module.exports = Block;
