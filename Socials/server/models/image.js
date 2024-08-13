const { DataTypes } = require('sequelize');
const sequelize = require('./db');
const User = require('./user'); // Import User model

const Image = sequelize.define('Image', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  url: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

Image.belongsTo(User, { // Define association
  foreignKey: {
    allowNull: false,
  },
  onDelete: 'CASCADE',
});

module.exports = Image;
