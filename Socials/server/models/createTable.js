// createTables.js
const sequelize = require('./db');
const User = require('./user');
const Post = require('./post');
const Comment = require('./comment');
const Like = require('./like');
const Follower = require('./follower');
const FollowRequest = require('./followerRequest');
const Block = require('./block');
const Story = require('./story');
require('dotenv').config();
console.log('Database:', process.env.DATABASENAME);
console.log('User:', process.env.USER);
const createTables = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.');

    await sequelize.sync({ force: true });
    console.log('All tables have been created successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  } finally {
    process.exit();
  }
};

createTables();
