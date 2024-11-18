const jwt = require('jsonwebtoken');

// Middleware to verify the JWT token and user access level
const authMiddleware = (requiredAccessLevel = 'read') => async (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];  // Get the token from the header

    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Check user access level
        if (decoded.accessLevel !== 'admin' && decoded.accessLevel !== requiredAccessLevel) {
            return res.status(403).json({ message: 'Access denied' });
        }

        req.user = decoded;  // Attach the user info to the request
        next();
    } catch (error) {
        console.error(error.message);
        res.status(401).json({ message: 'Token is not valid' });
    }
};

module.exports = authMiddleware;
