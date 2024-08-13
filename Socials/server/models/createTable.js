const sequelize = require('./db');
const Friend = require('./friend');
const Image = require('./image'); // Import mô hình Image
require('dotenv').config();


const createImageTable = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.');

    // Chỉ đồng bộ hóa bảng Image
    await Friend.sync({ force: true });
    console.log('Image table has been created successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  } finally {
    process.exit();
  }
};

createImageTable();
