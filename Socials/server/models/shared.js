const { DataTypes } = require('sequelize');
const sequelize = require('./db');
const User = require('./user');
const Post = require('./post');

const Shared = sequelize.define('Shared', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

Shared.belongsTo(User, { foreignKey: 'userId', onDelete: 'CASCADE' });
User.hasMany(Shared, { foreignKey: 'userId' });

Shared.belongsTo(Post, { foreignKey: 'postId', onDelete: 'CASCADE' });
Post.hasMany(Shared, { foreignKey: 'postId' });

module.exports = Shared;
