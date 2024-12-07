const mongoose = require('mongoose');

// Task schema
const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    completed: {
        type: Boolean,
        default: false,
    },
    dueDate: {
        type: Date,
        required: true,
    },
});

// Model
const Task = mongoose.model('Task', taskSchema);

module.exports = Task;