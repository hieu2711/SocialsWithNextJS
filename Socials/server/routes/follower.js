const express = require('express');
const Follower = require('../models/follower'); // Đảm bảo đường dẫn này chính xác
const router = express.Router();

// Follow or unfollow a user
router.post('/switchFollow/:userId', async (req, res) => {
    const { userId } = req.params;
    const { currentUserId } = req.body; // Assume currentUserId is passed in body

    console.log('UserId:', userId);
    console.log('CurrentUserId:', currentUserId);

    try {
        const existingFollow = await Follower.findOne({
            where: { followerId: currentUserId, followingId: userId }
        });

        console.log('ExistingFollow:', existingFollow);

        if (existingFollow) {
            await existingFollow.destroy();
            res.json({ success: true, message: 'Unfollowed user' });
        } else {
            await Follower.create({ followerId: currentUserId, followingId: userId });
            res.json({ success: true, message: 'Followed user' });
        }
    } catch (error) {
        console.error('Error switching follow:', error);
        res.status(500).json({ success: false, error: 'Error switching follow', error });
    }
});

module.exports = router;
