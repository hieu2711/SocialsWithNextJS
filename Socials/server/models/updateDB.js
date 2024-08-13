const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('./db'); // Đảm bảo đường dẫn đúng

const addUserSharedColumn = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.');

    // Thực hiện thêm trường mới vào bảng Post
    await sequelize.getQueryInterface().renameColumn('Shareds','decShared','descShared');
    console.log('Column userShared added to Posts table successfully.');
  } catch (error) {
    console.error('Error updating Posts table:', error);
  } finally {
    await sequelize.close();
  }
};

addUserSharedColumn();
