const express = require('express');
const { Block, User } = require('../models');
const router = express.Router();

// Block or unblock a user
router.post('/toggleBlock/:userId', async (req, res) => {
    const { userId } = req.params;
    const { currentUserId } = req.body; // Assume currentUserId is passed in body

    try {
        const existingBlock = await Block.findOne({
            where: { blockerId: currentUserId, blockedId: userId }
        });

        if (existingBlock) {
            await existingBlock.destroy();
            res.json({ success: true, message: 'Unblocked user' });
        } else {
            await Block.create({ blockerId: currentUserId, blockedId: userId });
            res.json({ success: true, message: 'Blocked user' });
        }
    } catch (error) {
        console.error('Error toggling block:', error);
        res.status(500).json({ success: false, error: 'Error toggling block' });
    }
});

module.exports = router;
