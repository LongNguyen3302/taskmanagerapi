const User = require('../models/User');
const jwt = require('jsonwebtoken');
// import dotenv from 'dotenv';
const dotenv = require('dotenv');
dotenv.config();

// Secret key cho JWT
// const JWT_SECRET = 'your_jwt_secret_key';

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


const loginUser = async (req, res) => {
    const { username, password } = req.body;

    try {
        // Check if the user exists
        const user = await User.findOne({ username, password });
        if (!user) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        // Generate a token
        const token = jwt.sign(
            {
                userId: user._id,
                username: user.username,
                accessLevel: user.accessLevel,
            },
            process.env.JWT_SECRET, // Use a secure key from your environment variables
            { expiresIn: '0.2h' } // Token expires in 1 hour
        );

        // Send the token to the client
        res.status(200).json({
            message: 'Login successful',
            token,
            userId: user._id
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server error' });
    }
};


// Lấy danh sách người dùng
const getUsers = async (req, res) => {
    try {
        // console.log(req.headers);
        // Extract the token from the Authorization header
        // const token = req.headers['authorization']?.split(' ')[1];
        token = req.headers.authorization;
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Check if the user has admin access
        if (decoded.accessLevel !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admin only.' });
        }

        // Fetch all users, excluding their passwords
        const users = await User.find().select('-password');
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
        // Extract the token from the Authorization header
        token = req.headers.authorization;
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Check if the user has admin access
        if (decoded.accessLevel !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admin only.' });
        }

        // Find and update the user
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

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
        // Extract the token from the Authorization header
        token = req.headers.authorization;
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Check if the user has admin access
        if (decoded.accessLevel !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admin only.' });
        }

        // Find and delete the user
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
