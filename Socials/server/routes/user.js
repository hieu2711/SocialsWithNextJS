const User = require('../models/user'); // Đảm bảo bạn đã xuất khẩu đúng kiểu User
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');

// Lấy tất cả người dùng
router.get('/getAll', async (req, res) => {
    try {
        const userList = await User.findAll();
        res.status(200).send(userList);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Lấy thông tin người dùng theo ID
router.get('/getUserById/:id', async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).send(user);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Đăng ký người dùng
router.post('/register', async (req, res) => {
    try {
        const { phone, password, name } = req.body;

        // Kiểm tra xem người dùng đã tồn tại chưa
        const existingUser = await User.findOne({ where: { phone } });
        if (existingUser) {
            return res.status(400).send('Phone number already in use');
        }

        // Băm mật khẩu
        const hashedPassword = bcrypt.hashSync(password, 10);

        // Tạo người dùng mới
        const user = await User.create({
            phone,
            password: hashedPassword,
            name,
        });

        res.status(201).send(user);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Đăng nhập
router.post('/login', async (req, res) => {
    try {
        const { phone, password } = req.body;

        // Tìm người dùng theo số điện thoại
        const user = await User.findOne({ where: { phone } });
        if (!user) {
            return res.status(400).send('User not found');
        }

        // Kiểm tra mật khẩu
        const validPassword = bcrypt.compareSync(password, user.password);
        if (!validPassword) {
            return res.status(400).send('Invalid password');
        }

        // Tạo token
        const secret = process.env.SECRET;
        const token = jwt.sign(
            { userId: user.id, phone: user.phone},
            secret,
            { expiresIn: '1d' }
        );

        res.status(200).send({ name:user.name, phone: user.phone, token, avt:user.avatar, id: user.id});
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Cập nhật thông tin người dùng
router.put('/update/:id', async (req, res) => {
    try {
        const {avatar, name, surname, description, city, school, work, website, password } = req.body;
        const user = await User.findByPk(req.params.id);

        if (!user) {
            return res.status(404).send('User not found');
        }

        // Cập nhật thông tin
        user.name = name || user.name;
        user.description = description || user.description;
        user.city = city || user.city;
        user.school = school || user.school;
        user.work = work || user.work;
        user.website = website || user.website;
        user.avatar = avatar || user.avatar;

        if (password) {
            user.password = bcrypt.hashSync(password, 10);
        }

        await user.save();
        res.status(200).send(user);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Xóa người dùng
router.delete('/delete/:id', async (req, res) => {
    try {
        const user = await User.destroy({ where: { id: req.params.id } });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.status(200).json({ success: true, message: 'User deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Đếm số lượng người dùng
router.get('/get/count', async (req, res) => {
    try {
        const userCount = await User.count();
        res.status(200).send({ userCount });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.get('/search', async (req, res) => {
    try {
        const { name } = req.query; // Lấy chuỗi tìm kiếm từ query parameters
        console.log("aloaloa" + req.query)
        if (!name || typeof name !== 'string') {
            return res.status(400).json({ success: false, message: 'Please provide a name to search' });
        }

        // Tìm kiếm người dùng có tên gần giống với chuỗi đã nhập
        const users = await User.findAll({
            where: {
                name: {
                    [Op.like]: `%${name}%` // Tìm kiếm tên có chứa chuỗi ký tự name
                }
            }
        });

        if (users.length === 0) {
            return res.status(404).json({ success: false, message: 'No users found' });
        }

        res.status(200).send(users);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
