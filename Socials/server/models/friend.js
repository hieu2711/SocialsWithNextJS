const { DataTypes } = require('sequelize');
const sequelize = require('./db');
const User = require('./user');

const Friend = sequelize.define('Friend', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
  },
  friendId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
  },
});

User.hasMany(Friend, { foreignKey: 'userId', as: 'friends' });
User.hasMany(Friend, { foreignKey: 'friendId', as: 'friendOf' });

module.exports = Friend;
