// models/FollowRequest.js
const { DataTypes } = require('sequelize');
const sequelize = require('./db');
const User = require('./user');

const FollowRequest = sequelize.define('FollowRequest', {
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

FollowRequest.belongsTo(User, { as: 'sender', foreignKey: 'senderId', onDelete: 'CASCADE' });
FollowRequest.belongsTo(User, { as: 'receiver', foreignKey: 'receiverId', onDelete: 'CASCADE' });

User.hasMany(FollowRequest, { as: 'followRequestsSent', foreignKey: 'senderId' });
User.hasMany(FollowRequest, { as: 'followRequestsReceived', foreignKey: 'receiverId' });

module.exports = FollowRequest;
