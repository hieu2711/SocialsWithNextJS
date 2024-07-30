// models/Comment.js
const { DataTypes } = require('sequelize');
const sequelize = require('./db');
const User = require('./user');
const Post = require('./post');

const Comment = sequelize.define('Comment', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  desc: {
    type: DataTypes.TEXT,
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

Comment.belongsTo(User, { foreignKey: 'userId', onDelete: 'CASCADE' });
User.hasMany(Comment, { foreignKey: 'userId' });

Comment.belongsTo(Post, { foreignKey: 'postId', onDelete: 'CASCADE' });
Post.hasMany(Comment, { foreignKey: 'postId' });

module.exports = Comment;
