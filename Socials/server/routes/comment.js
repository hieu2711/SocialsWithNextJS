const express = require('express');
const { Comment, Post, User } = require('../models');
const router = express.Router();

// Get all comments
router.get('/getAll', async (req, res) => {
    try {
        const comments = await Comment.findAll({ include: [Post, User] });
        res.json(comments);
    } catch (error) {
        console.error('Error fetching comments:', error);
        res.status(500).json({ success: false, error: 'Error fetching comments' });
    }
});

// Get comment by ID
router.get('/get/:id', async (req, res) => {
    try {
        const comment = await Comment.findByPk(req.params.id, { include: [Post, User] });
        if (!comment) {
            return res.status(404).json({ success: false, message: 'Comment not found' });
        }
        res.json(comment);
    } catch (error) {
        console.error('Error fetching comment:', error);
        res.status(500).json({ success: false, error: 'Error fetching comment' });
    }
});

// Create a new comment
router.post('/create', async (req, res) => {
    const { userId } = req.body;

    // Kiểm tra sự tồn tại của userId
    const user = await User.findByPk(userId);
    if (!user) {
        return res.status(404).json({ success: false, error: 'User not found' });
    }
    
    try {
        const comment = await Comment.create(req.body);
        res.status(201).json(comment);
    } catch (error) {
        console.error('Error creating comment:', error);
        res.status(500).json({ success: false, error: 'Error creating comment' });
    }
});

// Update comment
router.put('/update/:id', async (req, res) => {
    try {
        const [updated] = await Comment.update(req.body, {
            where: { id: req.params.id }
        });
        if (updated) {
            const updatedComment = await Comment.findByPk(req.params.id);
            res.json(updatedComment);
        } else {
            res.status(404).json({ success: false, message: 'Comment not found' });
        }
    } catch (error) {
        console.error('Error updating comment:', error);
        res.status(500).json({ success: false, error: 'Error updating comment' });
    }
});

// Delete comment
router.delete('/delete/:id', async (req, res) => {
    try {
        const deleted = await Comment.destroy({
            where: { id: req.params.id }
        });
        if (deleted) {
            res.json({ success: true, message: 'Comment deleted' });
        } else {
            res.status(404).json({ success: false, message: 'Comment not found' });
        }
    } catch (error) {
        console.error('Error deleting comment:', error);
        res.status(500).json({ success: false, error: 'Error deleting comment' });
    }
});

module.exports = router;
