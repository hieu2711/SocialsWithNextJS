// models/Post.js
const { DataTypes } = require('sequelize');
const sequelize = require('./db');
const User = require('./user');

const Post = sequelize.define('Post', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  desc: {
    type: DataTypes.TEXT,
  },
  img: {
    type: DataTypes.STRING,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  contentShared: {
    type: DataTypes.TEXT
  },
});

Post.belongsTo(User, { foreignKey: 'userId', onDelete: 'CASCADE' });
User.hasMany(Post, { foreignKey: 'userId' });

module.exports = Post;
