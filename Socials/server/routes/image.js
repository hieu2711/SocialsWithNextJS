const express = require('express');
const Image = require('../models/image');
const User = require('../models/user');
const router = express.Router();

// Create a new image
router.post('/create', async (req, res) => {
    const { userId, url } = req.body;
    console.log(userId, url)
    // Kiểm tra sự tồn tại của userId
    const user = await User.findByPk(userId);
    if (!user) {
        return res.status(404).json({ success: false, error: 'User not found' });
    }
    
    try {
        const image = await Image.create({ UserId: userId, url });
        res.status(201).json(image);
    } catch (error) {
        console.error('Error creating image:', error);
        res.status(500).json({ success: false, error: 'Error creating image' });
    }
});

// Get all images by user ID
router.get('/getAll/:userId', async (req, res) => {
    const userId = req.params.userId;
    const limit = parseInt(req.query.limit, 10) || null; // Lấy giá trị limit từ query string, nếu không có thì để null

    // Kiểm tra sự tồn tại của userId
    const user = await User.findByPk(userId);
    if (!user) {
        return res.status(404).json({ success: false, error: 'User not found' });
    }
    
    try {
        const queryOptions = {
            where: { userId },
            attributes: ['id', 'url', 'createdAt'],
            order: [['createdAt', 'DESC']] // Sắp xếp theo ngày tạo, có thể thay đổi nếu cần
        };

        if (limit) {
            queryOptions.limit = limit; // Áp dụng limit nếu có
        }

        const images = await Image.findAll(queryOptions);
        res.json(images);
    } catch (error) {
        console.error('Error fetching images:', error);
        res.status(500).json({ success: false, error: 'Error fetching images' });
    }
});

module.exports = router;
