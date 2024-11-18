const express = require('express');
const { createTask, getTasks, getTaskById, updateTask, deleteTask } = require('../controllers/taskC');
const router = express.Router();

// Define the routes
router.post('/tasks', createTask);        // Create a new task
router.get('/tasks', getTasks);           // Get all tasks
router.get('/tasks/:id', getTaskById);    // Get a single task by ID
router.put('/tasks/:id', updateTask);     // Update a task by ID
router.delete('/tasks/:id', deleteTask);  // Delete a task by ID

module.exports = router;
