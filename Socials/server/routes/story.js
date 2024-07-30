const express = require('express');
const { Story, User } = require('../models');
const { Op } = require('sequelize');
const router = express.Router();

// Get all stories
router.get('/getAll', async (req, res) => {
    try {
        // Lấy thời gian hiện tại
        const now = new Date().toISOString();

        // Tìm tất cả các câu chuyện chưa hết hạn
        const stories = await Story.findAll({
            include: {
                model: User,
                attributes: [
                    'id', 'phone', 'password', 'avatar', 'name', 
                    'description', 'city', 'school', 'work', 'website',
                    'createdAt', 'updatedAt'
                ] // Bao gồm các trường cần thiết từ User
            },
            where: {
                expiresAt: {
                    [Op.gt]: now // Chỉ lấy những câu chuyện có expiresAt sau thời gian hiện tại
                }
            },
            order: [['createdAt', 'ASC']] // Sắp xếp theo thứ tự tạo mới nhất
        });

        res.json(stories);
    } catch (error) {
        console.error('Error fetching stories:', error);
        res.status(500).json({ success: false, error: 'Error fetching stories' });
    }
});

// Get story by ID
router.get('/get/:id', async (req, res) => {
    try {
        const story = await Story.findByPk(req.params.id, { include: User });
        if (!story) {
            return res.status(404).json({ success: false, message: 'Story not found' });
        }
        res.json(story);
    } catch (error) {
        console.error('Error fetching story:', error);
        res.status(500).json({ success: false, error: 'Error fetching story' });
    }
});

// Create a new story
router.post('/create', async (req, res) => {
    const { userId, img } = req.body;

    // Kiểm tra sự tồn tại của userId
    const user = await User.findByPk(userId);
    if (!user) {
        return res.status(404).json({ success: false, error: 'User not found' });
    }

    try {
        // Tính toán expiresAt
        const createdAt = new Date();
        const expiresAt = new Date(createdAt);
        expiresAt.setDate(expiresAt.getDate() + 1); // Cộng thêm 1 ngày

        // Tạo story mới
        const story = await Story.create({
            userId,
            img,
            createdAt,
            expiresAt
        });

        res.status(201).json(story);
    } catch (error) {
        console.error('Error creating story:', error);
        res.status(500).json({ success: false, error: 'Error creating story' });
    }
});

// Update story
router.put('/update/:id', async (req, res) => {
    try {
        const [updated] = await Story.update(req.body, {
            where: { id: req.params.id }
        });
        if (updated) {
            const updatedStory = await Story.findByPk(req.params.id);
            res.json(updatedStory);
        } else {
            res.status(404).json({ success: false, message: 'Story not found' });
        }
    } catch (error) {
        console.error('Error updating story:', error);
        res.status(500).json({ success: false, error: 'Error updating story' });
    }
});

// Delete story
router.delete('/delete/:id', async (req, res) => {
    try {
        const deleted = await Story.destroy({
            where: { id: req.params.id }
        });
        if (deleted) {
            res.json({ success: true, message: 'Story deleted' });
        } else {
            res.status(404).json({ success: false, message: 'Story not found' });
        }
    } catch (error) {
        console.error('Error deleting story:', error);
        res.status(500).json({ success: false, error: 'Error deleting story' });
    }
});

module.exports = router;
