// models/Follower.js
const { DataTypes } = require('sequelize');
const sequelize = require('./db');
const User = require('./user');

const Follower = sequelize.define('Follower', {
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

Follower.belongsTo(User, { as: 'follower', foreignKey: 'followerId', onDelete: 'CASCADE' });
Follower.belongsTo(User, { as: 'following', foreignKey: 'followingId', onDelete: 'CASCADE' });

User.hasMany(Follower, { as: 'followers', foreignKey: 'followingId' });
User.hasMany(Follower, { as: 'followings', foreignKey: 'followerId' });

module.exports = Follower;
