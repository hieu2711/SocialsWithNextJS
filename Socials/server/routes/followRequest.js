const express = require('express');
// const { FollowRequest, User } = require('../models');
const FollowRequest = require('../models/followerRequest');
const { User } = require('../models');
const router = express.Router();

// routes/followRequest.js
router.post('/toggleFollowRequest/:userId', async (req, res) => {
    const { userId } = req.params;
    const { currentUserId } = req.body; // Assume currentUserId is passed in body

    console.log('UserId:', userId);
    console.log('CurrentUserId:', currentUserId);

    try {
        const existingRequest = await FollowRequest.findOne({
            where: { senderId: currentUserId, receiverId: userId }
        });

        console.log('ExistingRequest:', existingRequest);

        if (existingRequest) {
            await existingRequest.destroy();
            res.json({ success: true, message: 'Follow request cancelled' });
        } else {
            await FollowRequest.create({ senderId: currentUserId, receiverId: userId });
            res.json({ success: true, message: 'Follow request sent' });
        }
    } catch (error) {
        console.error('Error toggling follow request:', error);
        res.status(500).json({ success: false, error: 'Error toggling follow request' });
    }
});

router.get('/getFollowRequests/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        // Tìm tất cả các lời mời kết bạn mà userId là người nhận
        const followRequests = await FollowRequest.findAll({
            where: { receiverId: userId },
            include: [
                {
                    model: User,
                    as: 'sender',
                },
                {
                    model: User,
                    as: 'receiver',
                }
            ]
        });

        if (!followRequests.length) {
            return res.json({ success: false, message: 'No follow requests found for this user' });
        }

        res.json({ success: true, data: followRequests });
    } catch (error) {
        console.error('Error fetching follow requests:', error);
        res.status(500).json({ success: false, error: 'Error fetching follow requests' });
    }
});

module.exports = router;
