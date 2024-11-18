const Task = require('../models/Task');

// CREATE a new task
const createTask = async (req, res) => {
    try {
        const { title, description, completed, dueDate } = req.body;

        // Create a new task
        const newTask = new Task({
            title,
            description,
            completed,
            dueDate,
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
        const tasks = await Task.find();
        res.status(200).json(tasks);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

// READ a single task by ID
const getTaskById = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
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

        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Update task fields
        task.title = title || task.title;
        task.description = description || task.description;
        task.completed = completed || task.completed;
        task.dueDate = dueDate || task.dueDate;

        await task.save();
        res.status(200).json(task);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

// DELETE a task by ID
const deleteTask = async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
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
