const express = require('express');
const { Post, User, Like, Comment, Shared } = require('../models');
const { Op, col, literal } = require('sequelize');
const sequelize = require('../models/db');
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
    const { userId, postId, commentId } = req.body;

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

// Like/Unlike a cmt
router.post('/toggleLikeComment', async (req, res) => {
    const { userId, postId, commentId } = req.body;
    console.log('Request body:', req.body);
    // Kiểm tra sự tồn tại của userId và postId
    const user = await User.findByPk(userId);
    if (!user) {
        return res.status(404).json({ success: false, error: 'User not found' });
    }

    const comment = await Comment.findByPk(commentId);
    if (!comment) {
        return res.status(404).json({ success: false, error: 'Comment not found' });
    }
    
    const post = await Post.findByPk(postId);
    if (!post) {
        return res.status(404).json({ success: false, error: 'Post not found' });
    }

    try {
        // Kiểm tra xem người dùng đã like bài viết chưa
        const existingLike = await Like.findOne({
            where: { userId, commentId, postId }
        });

        if (existingLike) {
            // Nếu đã like rồi thì bỏ like
            await existingLike.destroy();
            res.json({ success: true, message: 'Unlike' });
        } else {
            // Nếu chưa like thì thêm like
            await Like.create({ userId, commentId, postId });
            res.json({ success: true, message: 'Like' });
        }
    } catch (error) {
        console.error('Error toggling like comment:', error);
        res.status(500).json({ success: false, error: 'Error toggling like comment' });
    }
});

// check isLiked
router.get('/check', async (req, res) => {
    const { userId, postId } = req.query;
    try {
        const like = await Like.findOne({ where: { userId, postId } });
        res.json({ isLiked: !!like });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});

//check isLiked Comment
router.get('/checkLikedComment', async (req, res) => {
    const { userId, postId, commentId } = req.query;
    try {
        // Kiểm tra nếu commentId có giá trị và chuyển đổi thành mảng
        if (commentId) {
            const commentIdArray = commentId.split(',');
            
            // Thực hiện truy vấn với mảng commentId
            const likedComments = await Like.findAll({
                where: {
                    userId,
                    postId,
                    commentId: {
                        [Op.in]: commentIdArray
                    }
                }
            });

            // Xử lý kết quả để trả về cho client
            const likedCommentIds = likedComments.map(like => like.commentId);
            res.json({ likedCommentIds });
        } else {
            // Trường hợp không có commentId
            res.json({ likedCommentIds: [] });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/likesCountComment', async (req, res) => {
    const {postId, commentId} = req.query
        
    console.log(req.query)
    try {
        // Tìm bài viết theo ID
        const post = await Post.findByPk(postId, {
            include: {
                model: Like,
                attributes: []
            }
        });

        if (!post) {
            return res.status(404).json({ success: false, message: 'Post not found' });
        }

        const comment = await Comment.findByPk(commentId, {
            include: {
                model: Like,
                attributes: []
            }
        });

        if (!comment) {
            return res.status(404).json({ success: false, message: 'Comment not found' });
        }

        // Đếm số lượt like của comment
        const likesCount = await Like.count({
            where: { postId, commentId }
        });

        res.json({ likesCount });
    } catch (error) {
        console.error('Error counting likes:', error);
        res.status(500).json({ success: false, error: 'Error counting likes' });
    }
});

//get all post with shared
router.get('/allPosts', async (req, res) => {
    try {
      // Truy vấn dữ liệu từ bảng Shared
      const sharedPosts = await Shared.findAll({
        attributes: ['id', 'descShared', 'image', 'createdAt', 'userId'],
        include: [{
          model: Post,
          attributes: ['id', 'desc', 'img', 'userId'] // Lấy userId từ bảng Post
        }]
      });
  
      // Truy vấn dữ liệu từ bảng Post
      const posts = await Post.findAll({
        attributes: ['id', 'desc', 'img', 'createdAt', 'userId'],
        include: [{
          model: Shared,
          attributes: ['id', 'descShared', 'image', 'userId'] // Lấy userId từ bảng Shared
        }]
      });
  
      // Kết hợp dữ liệu
      const combinedResults = sharedPosts.map(sharedPost => ({
        id: sharedPost.id,
        descShared: sharedPost.descShared,
        image: sharedPost.image,
        createdAt: sharedPost.createdAt,
        userIdShared: sharedPost.userId, // userId của bảng Shared
        desc: sharedPost.Post ? sharedPost.Post.desc : null,
        img: sharedPost.Post ? sharedPost.Post.img : null,
        userIdPost: sharedPost.Post ? sharedPost.Post.userId : null // userId của bảng Post
      }));
  
      // Thêm các post không có trong sharedPosts
      posts.forEach(post => {
        if (!combinedResults.some(result => result.id === post.id)) {
          combinedResults.push({
            id: post.id,
            descShared: null,
            image: null,
            createdAt: post.createdAt,
            userIdShared: null, // userId của bảng Shared
            desc: post.desc,
            img: post.img,
            userIdPost: post.userId // userId của bảng Post
          });
        }
      });
  
      // Trả kết quả
      res.json(combinedResults);
    } catch (error) {
      console.error('Error fetching posts and shares:', error);
      res.status(500).json({ message: 'Error fetching posts and shares' });
    }
  });



// API để lấy tất cả các bài post và shared dựa vào userId
router.get('/posts-and-user/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;

        // Lấy thông tin người dùng
        const user = await User.findByPk(userId, {
            attributes: ['id', 'phone', 'avatar', 'name', 'description', 'city', 'school', 'work', 'website', 'createdAt', 'updatedAt']
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Lấy tất cả các bài post của người dùng
        const posts = await Post.findAll({
            where: { userId },
            order: [['createdAt', 'DESC']],
            raw: true,
        });

        // Kết hợp thông tin người dùng vào từng bài post
        const postsWithUser = posts.map(post => ({
            ...post,
            contentShared: null, // Bạn có thể thay đổi nếu cần
            User: user
        }));

        // Trả về thông tin người dùng cùng với danh sách bài viết
        res.json(postsWithUser);
    } catch (error) {
        console.error('Error fetching posts and user:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


module.exports = router;
