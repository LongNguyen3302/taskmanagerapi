const express = require('express');
const { createTask, getTasks, getTaskById, updateTask, deleteTask } = require('../controllers/taskC');
const { authenticate } = require('../middleware/authMiddleware'); // Import your authentication middleware
const router = express.Router();


// Define the routes
router.post('/create', createTask);        // Create a new task
router.get('/gettask', getTasks);           // Get all tasks
router.put('/update', updateTask);     // Update a task by ID
router.delete('/delete', deleteTask);  // Delete a task by ID

module.exports = router;