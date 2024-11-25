const express = require('express');
const { createTask, getTasks, getTaskById, updateTask, deleteTask } = require('../controllers/taskC');
const { authenticate } = require('../middleware/authMiddleware'); // Import your authentication middleware
const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticate);

// Define the routes
router.post('/create', createTask);        // Create a new task
router.get('/gettask', getTasks);           // Get all tasks
router.get('/tasks/:id', getTaskById);    // Get a single task by ID
router.put('/tasks/:id', updateTask);     // Update a task by ID
router.delete('/tasks/:id', deleteTask);  // Delete a task by ID

module.exports = router;
