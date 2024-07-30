const express = require('express');
const { Post, User, Like, Comment } = require('../models');
const router = express.Router();

// Get all posts
router.get('/getAll', async (req, res) => {
    try {
        const posts = await Post.findAll({ include: User });
        res.json(posts);
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ success: false, error: 'Error fetching posts' });
    }
});

// Get post by ID
router.get('/get/:id', async (req, res) => {
    try {
        const post = await Post.findByPk(req.params.id, { include: User });
        if (!post) {
            return res.status(404).json({ success: false, message: 'Post not found' });
        }
        res.json(post);
    } catch (error) {
        console.error('Error fetching post:', error);
        res.status(500).json({ success: false, error: 'Error fetching post' });
    }
});

// Create a new post
router.post('/create', async (req, res) => {
    const { userId, img, desc} = req.body;

    // Kiểm tra sự tồn tại của userId
    const user = await User.findByPk(userId);
    if (!user) {
        return res.status(404).json({ success: false, error: 'User not found' });
    }
    
    try {
        const post = await Post.create(req.body);
        res.status(201).json(post);
    } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({ success: false, error: 'Error creating post' });
    }
});

// Update post
router.put('/update/:id', async (req, res) => {
    try {
        const [updated] = await Post.update(req.body, {
            where: { id: req.params.id }
        });
        if (updated) {
            const updatedPost = await Post.findByPk(req.params.id);
            res.json(updatedPost);
        } else {
            res.status(404).json({ success: false, message: 'Post not found' });
        }
    } catch (error) {
        console.error('Error updating post:', error);
        res.status(500).json({ success: false, error: 'Error updating post' });
    }
});

// Delete post
router.delete('/delete/:id', async (req, res) => {
    try {
        const deleted = await Post.destroy({
            where: { id: req.params.id }
        });
        if (deleted) {
            res.json({ success: true, message: 'Post deleted' });
        } else {
            res.status(404).json({ success: false, message: 'Post not found' });
        }
    } catch (error) {
        console.error('Error deleting post:', error);
        res.status(500).json({ success: false, error: 'Error deleting post' });
    }
});

router.get('/likesCount/:id', async (req, res) => {
    try {
        // Tìm bài viết theo ID
        const post = await Post.findByPk(req.params.id, {
            include: {
                model: Like,
                attributes: [] // Chỉ cần số lượng, không cần lấy dữ liệu của Like
            }
        });

        if (!post) {
            return res.status(404).json({ success: false, message: 'Post not found' });
        }

        // Đếm số lượt like của bài viết
        const likesCount = await Like.count({
            where: { postId: req.params.id }
        });

        res.json({ likesCount });
    } catch (error) {
        console.error('Error counting likes:', error);
        res.status(500).json({ success: false, error: 'Error counting likes' });
    }
});

// Đếm số lượng comment của một bài viết
router.get('/commentsCount/:id', async (req, res) => {
    try {
        // Tìm bài viết theo ID
        const post = await Post.findByPk(req.params.id, {
            include: {
                model: Comment,
                attributes: [] // Chỉ cần số lượng, không cần lấy dữ liệu của Comment
            }
        });

        if (!post) {
            return res.status(404).json({ success: false, message: 'Post not found' });
        }

        // Đếm số lượng comment của bài viết
        const commentsCount = await Comment.count({
            where: { postId: req.params.id }
        });

        res.json({ commentsCount });
    } catch (error) {
        console.error('Error counting comments:', error);
        res.status(500).json({ success: false, error: 'Error counting comments' });
    }
});

// Like/Unlike a post
router.post('/toggleLike', async (req, res) => {
    const { userId, postId } = req.body;

    // Kiểm tra sự tồn tại của userId và postId
    const user = await User.findByPk(userId);
    if (!user) {
        return res.status(404).json({ success: false, error: 'User not found' });
    }

    const post = await Post.findByPk(postId);
    if (!post) {
        return res.status(404).json({ success: false, error: 'Post not found' });
    }

    try {
        // Kiểm tra xem người dùng đã like bài viết chưa
        const existingLike = await Like.findOne({
            where: { userId, postId }
        });

        if (existingLike) {
            // Nếu đã like rồi thì bỏ like
            await existingLike.destroy();
            res.json({ success: true, message: 'Unlike' });
        } else {
            // Nếu chưa like thì thêm like
            await Like.create({ userId, postId });
            res.json({ success: true, message: 'Like' });
        }
    } catch (error) {
        console.error('Error toggling like:', error);
        res.status(500).json({ success: false, error: 'Error toggling like' });
    }
});

module.exports = router;
