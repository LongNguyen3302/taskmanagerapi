const mongoose = require('mongoose');

// MongoDB connection string
const dbURI = 'mongodb+srv://36tranhungdao:ngyt2004@cluster0.lfnf5.mongodb.net/taskmanager?retryWrites=true&w=majority&appName=Cluster0\'';

// Connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(dbURI, {
        });
        console.log('MongoDB connected successfully!');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error.message);
        process.exit(1); // Exit process with failure
    }
};

module.exports = connectDB;
