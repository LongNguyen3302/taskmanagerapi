const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const { authenticate, authorize } = require('../middleware/authMiddleware');

router.get('/', authenticate, async (req, res) => {
    const projects = await Project.find({ ownerId: req.user._id });
    res.json(projects);
});

router.post('/', authenticate, authorize('write'), async (req, res) => {
    const { name, description } = req.body;
    const project = new Project({ name, description, ownerId: req.user._id });
    await project.save();
    res.status(201).json(project);
});

// PUT and DELETE endpoints...

module.exports = router;
