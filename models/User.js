const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    accessLevel: { type: String, enum: ['read', 'write', 'admin'], required: true },
    token: { type: String },
});

module.exports = mongoose.model('User', UserSchema);
