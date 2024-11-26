const Task = require('../models/Task');
const Project = require('../models/Project');
const jwt = require('jsonwebtoken');

// Helper function to verify if a user is a collaborator
const isCollaborator = async (userId, projectId) => {
    try {
        const project = await Project.findById(projectId);
        if (!project) return false;

        console.log("Project collaborators:", project.collaborators);  // Log danh sách collaborators

        return (
            project.ownerId.toString() === userId ||
            project.collaborators.some(collaborator => collaborator.toString() === userId)
        );
    } catch (error) {
        console.error('Error in isCollaborator:', error.message);
        return false;
    }
};


// **Create a new task**
const createTask = async (req, res) => {
    const { title, description, dueDate, projectId } = req.body;
    const userId = req.user.userId;
    console.log("userId:", userId);       // Log để kiểm tra userId


    try {
        // Check access to the project
        const hasAccess = await isCollaborator(userId, projectId);
        if (!hasAccess) {
            return res.status(403).json({ message: 'You are not authorized to create tasks in this project' });
        }

        // Create a new task
        const newTask = new Task({
            title,
            description,
            dueDate,
            projectId,
            ownerId: userId,
        });

        await newTask.save();
        res.status(201).json({ message: 'Task created successfully', task: newTask });
    } catch (error) {
        console.error('Error creating task:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

// **Get all tasks in a project**
// const getTasks = async (req, res) => {
//     const { projectId } = req.query;
//     const userId = req.user.userId;
//
//     try {
//         // Check access to the project
//         const hasAccess = await isCollaborator(userId, projectId);
//         if (!hasAccess) {
//             return res.status(403).json({ message: 'You are not authorized to view tasks in this project' });
//         }
//
//         // Fetch tasks
//         const tasks = await Task.find({ projectId });
//         res.json(tasks);
//     } catch (error) {
//         console.error('Error fetching tasks:', error.message);
//         res.status(500).json({ message: 'Server error' });
//     }
// };
const getTasks = async (req, res) => {
    const { projectId } = req.query;  // Lấy projectId từ query
    const userId = req.user.userId;   // Lấy userId từ JWT token

    console.log("projectId:", projectId);  // Log projectId
    console.log("userId:", userId);        // Log userId

    try {
        // Kiểm tra quyền truy cập vào dự án
        const hasAccess = await isCollaborator(userId, projectId);
        if (!hasAccess) {
            return res.status(403).json({ message: 'You are not authorized to view tasks in this project' });
        }

        // Lấy danh sách tasks từ MongoDB
        const tasks = await Task.find({ projectId });


        console.log("Tasks fetched:", tasks); // Log tasks

        if (tasks.length === 0) {
            return res.status(200).json({ message: 'No tasks found for this project' });
        }

        res.json(tasks);  // Trả về tasks dưới dạng JSON
    } catch (error) {
        console.error('Error fetching tasks:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
};



// **Update a task**
const updateTask = async (req, res) => {
    const { id } = req.params;
    const { title, description, dueDate, status } = req.body;
    const userId = req.user.userId;

    try {
        const task = await Task.findById(id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Check access to the project
        const hasAccess = await isCollaborator(userId, task.projectId);
        if (!hasAccess) {
            return res.status(403).json({ message: 'You are not authorized to update tasks in this project' });
        }

        // Update task fields
        if (title) task.title = title;
        if (description) task.description = description;
        if (dueDate) task.dueDate = dueDate;
        if (status) task.status = status;

        await task.save();
        res.json({ message: 'Task updated successfully', task });
    } catch (error) {
        console.error('Error updating task:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

// **Delete a task**
const deleteTask = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.userId;

    try {
        const task = await Task.findById(id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Check access to the project
        const hasAccess = await isCollaborator(userId, task.projectId);
        if (!hasAccess) {
            return res.status(403).json({ message: 'You are not authorized to delete tasks in this project' });
        }

        await task.remove();
        res.json({ message: 'Task deleted successfully' });
    } catch (error) {
        console.error('Error deleting task:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    createTask,
    getTasks,
    updateTask,
    deleteTask,
};
