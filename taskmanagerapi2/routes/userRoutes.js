const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUsers, updateUser, deleteUser } = require('../controllers/userC');
const authMiddleware = require('../middleware/authMiddleware');

// Đăng ký người dùng
router.post('/register', registerUser);

// Đăng nhập người dùng
router.post('/login', loginUser);

// Lấy danh sách người dùng (cần quyền admin)
// router.get('/usergetdata', getUsers);
router.get('/getall', authMiddleware('admin'), getUsers);
// Cập nhật người dùng (cần quyền admin)
router.put('/:id', authMiddleware('admin'), updateUser);

// Xóa người dùng (cần quyền admin)
router.delete('/:id', authMiddleware('admin'), deleteUser);

module.exports = router;
