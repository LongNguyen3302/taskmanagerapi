// const express = require('express');
// const { createTask, getTasks, updateTask, deleteTask } = require('../controllers/taskC');
// const attachProject = require('../middleware/attachProject'); // Import middleware
// const authMiddleware = require('../middleware/authMiddleware');
//
// const router = express.Router();
//
// router.post('/create', attachProject, createTask); // Gán project trước khi tạo task
// router.get('/gettask', authMiddleware('read'), getTasks); // Lấy danh sách task
// router.put('/:id', attachProject, updateTask); // Gán project trước khi cập nhật task
// router.delete('/:id', attachProject, deleteTask); // Gán project trước khi xóa task
//
// module.exports = router;
const express = require('express');
const { createTask, getTasks, updateTask, deleteTask } = require('../controllers/taskc');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/create', authMiddleware('read'), createTask);
router.get('/gettask', authMiddleware('read'), getTasks);
router.put('/:id', authMiddleware('read'), updateTask);
router.delete('/:id', authMiddleware('read'), deleteTask);

module.exports = router;