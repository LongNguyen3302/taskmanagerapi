const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username, password });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const token = `token_${Date.now()}`;
    user.token = token;
    await user.save();

    res.json({ token, accessLevel: user.accessLevel });
});

module.exports = router;
