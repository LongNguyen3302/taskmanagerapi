const Project = require('../models/Project');

// Lấy tất cả dự án của người dùng đã xác thực
const getProjects = async (req, res) => {
    try {
        const projects = await Project.find({ ownerId: req.user._id }); // Chỉ lấy các dự án của người dùng đã đăng nhập
        res.json(projects);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

// Tạo một dự án mới
const createProject = async (req, res) => {
    const { name, description } = req.body;

    try {
        const project = new Project({
            name,
            description,
            ownerId: req.user._id, // Gán ID của người dùng đã đăng nhập làm chủ sở hữu dự án
        });

        await project.save(); // Lưu dự án vào cơ sở dữ liệu
        res.status(201).json(project);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

// Cập nhật một dự án
const updateProject = async (req, res) => {
    const { id } = req.params;
    const { name, description } = req.body;

    try {
        const project = await Project.findOneAndUpdate(
            { _id: id, ownerId: req.user._id }, // Chỉ cho phép cập nhật các dự án thuộc về người dùng
            { name, description },
            { new: true } // Trả về dự án sau khi cập nhật
        );

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        res.json(project);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

// Xóa một dự án
const deleteProject = async (req, res) => {
    const { id } = req.params;

    try {
        const project = await Project.findOneAndDelete({
            _id: id,
            ownerId: req.user._id, // Chỉ cho phép xóa các dự án thuộc về người dùng
        });

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
