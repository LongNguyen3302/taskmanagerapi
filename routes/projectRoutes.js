const express = require('express');
const router = express.Router();
const { getProjects, createProject, updateProject, deleteProject } = require('../controllers/projectC');
const authMiddleware = require('../middleware/authMiddleware');

// Routes
router.get('/get', authMiddleware('read'), getProjects); // All authenticated users can view projects
router.post('/create', authMiddleware('admin'), createProject); // Admins only
router.put('/:id', authMiddleware('admin'), updateProject); // Admins only
router.delete('/:id', authMiddleware('admin'), deleteProject);


module.exports = router;

//nó vào được nếu có token nhưng nó chỉ có thể ap dụng cho admin tại vì token mặt định khi mà nó tạo ra chứ nó không có tạo một cái token mới
