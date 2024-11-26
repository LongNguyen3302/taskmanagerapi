// const Project = require('../models/Project');
//
// // Lấy tất cả dự án của người dùng đã xác thực
// const getProjects = async (req, res) => {
//     try {
//         const projects = await Project.find({ ownerId: req.user._id }); // Chỉ lấy các dự án của người dùng đã đăng nhập
//         res.json(projects);
//     } catch (error) {
//         console.error(error.message);
//         res.status(500).json({ message: 'Server error' });
//     }
// };
//
// // Tạo một dự án mới
// const createProject = async (req, res) => {
//     const { name, description } = req.body;
//
//     try {
//         const project = new Project({
//             name,
//             description,
//             ownerId: req.user._id, // Gán ID của người dùng đã đăng nhập làm chủ sở hữu dự án
//         });
//
//         await project.save(); // Lưu dự án vào cơ sở dữ liệu
//         res.status(201).json(project);
//     } catch (error) {
//         console.error(error.message);
//         res.status(500).json({ message: 'Server error' });
//     }
// };
//
// // Cập nhật một dự án
// const updateProject = async (req, res) => {
//     const { id } = req.params;
//     const { name, description } = req.body;
//
//     try {
//         const project = await Project.findOneAndUpdate(
//             { _id: id, ownerId: req.user._id }, // Chỉ cho phép cập nhật các dự án thuộc về người dùng
//             { name, description },
//             { new: true } // Trả về dự án sau khi cập nhật
//         );
//
//         if (!project) {
//             return res.status(404).json({ message: 'Project not found' });
//         }
//
//         res.json(project);
//     } catch (error) {
//         console.error(error.message);
//         res.status(500).json({ message: 'Server error' });
//     }
// };
//
// // Xóa một dự án
// const deleteProject = async (req, res) => {
//     const { id } = req.params;
//
//     try {
//         const project = await Project.findOneAndDelete({
//             _id: id,
//             ownerId: req.user._id, // Chỉ cho phép xóa các dự án thuộc về người dùng
//         });
//
//         if (!project) {
//             return res.status(404).json({ message: 'Project not found' });
//         }
//
//         res.json({ message: 'Project deleted successfully' });
//     } catch (error) {
//         console.error(error.message);
//         res.status(500).json({ message: 'Server error' });
//     }
// };
//
// module.exports = {
//     getProjects,
//     createProject,
//     updateProject,
//     deleteProject,
// };
const Project = require('../models/Project');
const jwt = require('jsonwebtoken');
// import dotenv from 'dotenv';
const dotenv = require('dotenv');
dotenv.config();

// Get all projects (Admin and users can view their projects)
const getProjects = async (req, res) => {
    try {
        // Admins can view all projects; users can only view their own
        const query = req.user.role === 'admin' ? {} : { ownerId: req.user.userId };
        const projects = await Project.find(query).populate('collaborators', 'username ');
        res.json(projects);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

const createProject = async (req, res) => {
    const { name, description, collaborators } = req.body;

    try {
        // Thay vì sử dụng req.user._id, hãy sử dụng req.user.userId
        const project = new Project({
            name,
            description,
            ownerId: req.user.userId, // Sử dụng userId thay vì _id
            collaborators,
        });

        await project.save();
        res.status(201).json(project);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update a project (Admin only)
const updateProject = async (req, res) => {
    const { id } = req.params;
    const { name, description, collaborators } = req.body;

    try {
        token = req.headers.authorization;
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Check if the user has admin access
        if (decoded.accessLevel !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admin only.' });
        }

        const project = await Project.findByIdAndUpdate(
            id,
            { name, description, collaborators },
            { new: true }
        );

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        res.json({ message: 'Project updated successfully', project });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete a project (Admin only)
const deleteProject = async (req, res) => {
    const { id } = req.params;

    try {
        token = req.headers.authorization;
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Check if the user has admin access
        if (decoded.accessLevel !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admin only.' });
        }

        const project = await Project.findByIdAndDelete(id);

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        res.json({ message: 'Project deleted successfully' });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    getProjects,
    createProject,
    updateProject,
    deleteProject,
};
