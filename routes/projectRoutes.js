const express = require('express');
const router = express.Router();
const { getProjects, createProject, updateProject, deleteProject } = require('../controllers/projectC');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', getProjects);
router.post('/',  authMiddleware('write'), createProject);
router.put('/:id',  authMiddleware('write'), updateProject);
router.delete('/:id', authMiddleware('write'), deleteProject);


module.exports = router;
