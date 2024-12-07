const Task = require('../models/Task');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

// Helper function to verify token and access level
const verifyAccess = (req, res, requiredAccessLevels) => {
    const token = req.headers.authorization;
    if (!token) {
        return { success: false, message: 'No token provided', statusCode: 401 };
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!requiredAccessLevels.includes(decoded.accessLevel)) {
            return { success: false, message: 'Access denied', statusCode: 403 };
        }
        return { success: true, user: decoded };
    } catch (error) {
        return { success: false, message: 'Invalid token', statusCode: 401 };
    }
};

// Create a new task
const createTask = async (req, res) => {
    const { title, description, dueDate, projectId } = req.body;

    const authResult = verifyAccess(req, res, ['read']);
    if (!authResult.success) {
        return res.status(authResult.statusCode).json({ message: authResult.message });
    }

    try {
        const newTask = new Task({ title, description, dueDate, projectId });
        await newTask.save();
        res.status(201).json({ message: 'Task created successfully', task: newTask });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get all tasks
const getTasks = async (req, res) => {
    const authResult = verifyAccess(req, res, ['read', 'admin']);
    if (!authResult.success) {
        return res.status(authResult.statusCode).json({ message: authResult.message });
    }

    try {
        const tasks = await Task.find();
        res.json(tasks);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update a task
const updateTask = async (req, res) => {
    const { id } = req.params;
    const { title, description, dueDate, status } = req.body;

    const authResult = verifyAccess(req, res, ['read']);
    if (!authResult.success) {
        return res.status(authResult.statusCode).json({ message: authResult.message });
    }

    try {
        const task = await Task.findById(id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        if (title) task.title = title;
        if (description) task.description = description;
        if (dueDate) task.dueDate = dueDate;
        if (status) task.status = status;

        await task.save();
        res.json({ message: 'Task updated successfully', task });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete a task
const deleteTask = async (req, res) => {
    const { id } = req.params;

    const authResult = verifyAccess(req, res, ['read']);
    if (!authResult.success) {
        return res.status(authResult.statusCode).json({ message: authResult.message });
    }

    try {
        const task = await Task.findByIdAndDelete(id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        res.json({ message: 'Task deleted successfully' });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    createTask,
    getTasks,
    updateTask,
    deleteTask,
};