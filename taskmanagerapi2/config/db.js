const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
// Connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.dbURI, {
        });
        console.log('MongoDB connected successfully!');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error.message);
        process.exit(1); // Exit process with failure
    }
};

module.exports = connectDB;
