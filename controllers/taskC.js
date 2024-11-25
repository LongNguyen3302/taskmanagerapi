const Task = require('../models/Task');
const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach the decoded user info to the request object
        next();
    } catch (error) {
        res.status(403).json({ message: 'Invalid or expired token' });
    }
};

module.exports = { authenticate };
// CREATE a new task
const createTask = async (req, res) => {
    try {
        const { title, description, completed, dueDate } = req.body;

        // Create a new task linked to the authenticated user
        const newTask = new Task({
            title,
            description,
            completed,
            dueDate,
            user: req.user.id, // User from the JWT token
        });

        await newTask.save();
        res.status(201).json(newTask);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server error' });
    }
};


// READ all tasks
const getTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ user: req.user.id }); // Filter by user ID
        res.status(200).json(tasks);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server error' });
    }
};


// READ a single task by ID
const getTaskById = async (req, res) => {
    try {
        const task = await Task.findOne({ _id: req.params.id, user: req.user.id }); // Match task and user
        if (!task) {
            return res.status(404).json({ message: 'Task not found or access denied' });
        }
        res.status(200).json(task);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server error' });
    }
};


// UPDATE a task by ID
const updateTask = async (req, res) => {
    try {
        const { title, description, completed, dueDate } = req.body;

        // Ensure the task belongs to the user
        const task = await Task.findOne({ _id: req.params.id, user: req.user.id });
        if (!task) {
            return res.status(404).json({ message: 'Task not found or access denied' });
        }

        // Update task fields
        task.title = title || task.title;
        task.description = description || task.description;
        task.completed = completed !== undefined ? completed : task.completed;
        task.dueDate = dueDate || task.dueDate;

        await task.save();
        res.status(200).json(task);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

const deleteTask = async (req, res) => {
    try {
        // Ensure the task belongs to the user
        const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user.id });
        if (!task) {
            return res.status(404).json({ message: 'Task not found or access denied' });
        }
        res.status(200).json({ message: 'Task deleted' });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server error' });
    }
};


module.exports = {
    createTask,
    getTasks,
    getTaskById,
    updateTask,
    deleteTask,
};
