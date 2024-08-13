const express = require('express');
const router = express.Router();
const FollowRequest = require('../models/followerRequest');
const Friend = require('../models/friend');
const User = require('../models/user');
const { Op } = require('sequelize');

// routes/friendRequest.js
router.post('/acceptFriendRequest', async (req, res) => {
    const { senderId, receiverId } = req.body;

    console.log('SenderId:', senderId);
    console.log('ReceiverId:', receiverId);

    try {
        // Tìm yêu cầu kết bạn
        const request = await FollowRequest.findOne({
            where: { senderId: senderId, receiverId: receiverId }
        });

        if (!request) {
            return res.json({ success: false, message: 'Friend request not found' });
        }

        // Xóa yêu cầu kết bạn
        await request.destroy();

        // Lưu thông tin vào bảng Friend
        await Friend.create({ userId: senderId, friendId: receiverId });
        await Friend.create({ userId: receiverId, friendId: senderId });

        res.json({ success: true, message: 'Friend request accepted and saved' });
    } catch (error) {
        console.error('Error accepting friend request:', error);
        res.status(500).json({ success: false, error: 'Error accepting friend request' });
    }
});

router.post('/rejectFriendRequest', async (req, res) => {
    const { senderId, receiverId } = req.body;

    // Kiểm tra xem các giá trị có hợp lệ không
    if (!senderId || !receiverId) {
        return res.status(400).json({ success: false, message: 'Missing senderId or receiverId' });
    }

    try {
        // Tìm yêu cầu kết bạn
        const request = await FollowRequest.findOne({
            where: { senderId: senderId, receiverId: receiverId }
        });

        if (!request) {
            return res.json({ success: false, message: 'Friend request not found' });
        }

        // Xóa yêu cầu kết bạn
        await request.destroy();

        res.json({ success: true, message: 'Friend request rejected and removed' });
    } catch (error) {
        console.error('Error rejecting friend request:', error);
        res.status(500).json({ success: false, error: 'Error rejecting friend request' });
    }
});

router.post('/removeFriend', async (req, res) => {
    const { userId, friendId } = req.body;

    // Kiểm tra xem các giá trị có hợp lệ không
    if (!userId || !friendId) {
        return res.status(400).json({ success: false, message: 'Missing userId or friendId' });
    }

    try {
        // Xóa mối quan hệ từ userId đến friendId
        const result1 = await Friend.destroy({
            where: {
                userId: userId,
                friendId: friendId
            }
        });

        // Xóa mối quan hệ từ friendId đến userId
        const result2 = await Friend.destroy({
            where: {
                userId: friendId,
                friendId: userId
            }
        });

        if (result1 === 0 && result2 === 0) {
            return res.json({ success: false, message: 'Friendship not found or already removed' });
        }

        res.json({ success: true, message: 'Friend removed successfully' });
    } catch (error) {
        console.error('Error removing friend:', error);
        res.status(500).json({ success: false, error: 'Error removing friend' });
    }
});


router.get('/getFriends/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        // Tìm tất cả các bạn bè của userId trong bảng Friend
        const friends = await Friend.findAll({
            where: {
                [Op.or]: [
                    { userId: userId },
                    { friendId: userId }
                ]
            }
        });

        // Lấy danh sách ID bạn bè
        const friendIds = friends.map(friend => 
            friend.userId === parseInt(userId) ? friend.friendId : friend.userId
        );

        // Tìm thông tin chi tiết của các bạn bè
        const userFriends = await User.findAll({
            where: {
                id: friendIds
            }
        });

        res.json({ success: true, friends: userFriends });
    } catch (error) {
        console.error('Error getting friends:', error);
        res.status(500).json({ success: false, message: 'Error getting friends' });
    }
});

router.post('/checkFriendship', async (req, res) => {
    const { userId, friendId } = req.body;

    // Kiểm tra xem các giá trị có hợp lệ không
    if (!userId || !friendId) {
        return res.status(400).json({ success: false, message: 'Missing userId or friendId' });
    }

    try {
        // Kiểm tra xem có tồn tại mối quan hệ bạn bè giữa userId và friendId không
        const friendship = await Friend.findOne({
            where: {
                [Op.or]: [
                    { userId: userId, friendId: friendId },
                    { userId: friendId, friendId: userId }
                ]
            }
        });

        if (friendship) {
            return res.json({ success: true, message: 'true' });
        } else {
            return res.json({ success: false, message: 'false' });
        }
    } catch (error) {
        console.error('Error checking friendship:', error);
        res.status(500).json({ success: false, message: 'Error checking friendship' });
    }
});

module.exports = router;
