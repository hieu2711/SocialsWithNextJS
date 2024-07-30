const express = require('express');
const { Shared, User, Post } = require('../models');
const router = express.Router();

// Get count of shares for a post by postId
router.get('/count/:postId', async (req, res) => {
  try {
    const { postId } = req.params;
    const count = await Shared.count({ where: { postId } });
    res.json({ success: true, postId, shareCount: count });
  } catch (error) {
    console.error('Error counting shares:', error);
    res.status(500).json({ success: false, error: 'Error counting shares' });
  }
});

// Create a new share
router.post('/create', async (req, res) => {
    const { userId, postId } = req.body;
  
    try {
      // Kiểm tra sự tồn tại của userId và postId
      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({ success: false, error: 'User not found' });
      }
  
      const post = await Post.findByPk(postId);
      if (!post) {
        return res.status(404).json({ success: false, error: 'Post not found' });
      }
  
      // Kiểm tra nếu user là người tạo post
      if (post.userId === userId) {
        return res.status(400).json({ success: false, error: 'User cannot share their own post' });
      }
  
      // Tạo lượt share mới
      const newShare = await Shared.create({ userId, postId });
      res.status(201).json({ success: true, share: newShare });
    } catch (error) {
      console.error('Error creating share:', error);
      res.status(500).json({ success: false, error: 'Error creating share' });
    }
  });
  

module.exports = router;
