const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Secret key cho JWT
const JWT_SECRET = 'your_jwt_secret_key';

// Đăng ký người dùng
const registerUser = async (req, res) => {
    const { username, password, accessLevel } = req.body;

    try {
        // Kiểm tra nếu username đã tồn tại
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        // Tạo người dùng mới
        const newUser = new User({ username, password, accessLevel });
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

// Đăng nhập người dùng
const loginUser = async (req, res) => {
    const { username, password } = req.body;

    try {
        // Tìm người dùng
        const user = await User.findOne({ username, password });
        if (!user) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        // Nếu tìm thấy người dùng
        res.status(200).json({
            message: 'Login successful',
            user: {
                id: user._id,
                username: user.username,
                accessLevel: user.accessLevel
            }
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server error' });
    }
};


// Lấy danh sách người dùng
const getUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password'); // Không gửi mật khẩu về client
        res.json(users);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

// Cập nhật thông tin người dùng
const updateUser = async (req, res) => {
    const { id } = req.params;
    const { username, accessLevel } = req.body;

    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Cập nhật thông tin
        if (username) user.username = username;
        if (accessLevel) user.accessLevel = accessLevel;

        await user.save();
        res.json({ message: 'User updated successfully', user });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

// Xóa người dùng
const deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findByIdAndDelete(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getUsers,
    updateUser,
    deleteUser,
};
