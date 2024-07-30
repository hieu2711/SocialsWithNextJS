// server.js
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const mysql = require('mysql2');
const sequelize = require('./models/db');
const userRoutes = require('./routes/user');
const followerRoutes = require('./routes/follower');
const followRequestRoutes = require('./routes/followRequest');
const blockRoutes = require('./routes/block');
const postRoutes = require('./routes/post');
const storyRoutes = require('./routes/story');
const commentRoutes = require('./routes/comment');
const sharedRoutes = require('./routes/shared');
const errorHandler = require('./helpers/error-handler');
const bodyParser = require('body-parser');
require('dotenv/config');

const app = express();

app.use(cors());
app.options('*', cors());
app.use(express.json());
app.use(morgan('tiny'));


// Test database connection
sequelize.authenticate()
  .then(() => console.log('Database connection established successfully.'))
  .catch(err => console.error('Unable to connect to the database:', err));

// Database sync
sequelize.sync()
  .then(() => console.log('All models were synchronized successfully.'))
  .catch(err => console.error('Unable to sync database:', err));

app.use(bodyParser.json());
app.use('/api/users', userRoutes);
app.use('/api/followers', followerRoutes);
app.use('/api/followRequests', followRequestRoutes);
app.use('/api/blocks', blockRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/stories', storyRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/shared', sharedRoutes);

// Server setup
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
