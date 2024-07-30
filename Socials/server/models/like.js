// models/Like.js
const { DataTypes } = require('sequelize');
const sequelize = require('./db');
const User = require('./user');
const Post = require('./post');
const Comment = require('./comment');

const Like = sequelize.define('Like', {
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

Like.belongsTo(User, { foreignKey: 'userId', onDelete: 'CASCADE' });
User.hasMany(Like, { foreignKey: 'userId' });

Like.belongsTo(Post, { foreignKey: 'postId', onDelete: 'CASCADE' });
Post.hasMany(Like, { foreignKey: 'postId' });

Like.belongsTo(Comment, { foreignKey: 'commentId', onDelete: 'CASCADE' });
Comment.hasMany(Like, { foreignKey: 'commentId' });

module.exports = Like;
