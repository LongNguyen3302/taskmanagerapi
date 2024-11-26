// const jwt = require('jsonwebtoken');
// const dotenv = require('dotenv');
// dotenv.config();
//
// // Middleware to verify the JWT token and user access level
// const authMiddleware = (requiredAccessLevel = 'read') => async (req, res, next) => {
//     // console.log(req.headers);
//     // console.log(req.headers.authorization);
//     // const token = req.headers['authorization']?.split(' ')[1];  // Get the token from the header
//     const token = req.headers.authorization;
//     if (!token) {
//         return res.status(401).json({ message: 'No token, authorization denied' });
//     }
//
//     try {
//         // Verify the token
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         req.user = decoded;
//
//         // Check user access level
//         if (decoded.accessLevel !== 'admin' && decoded.accessLevel !== requiredAccessLevel) {
//             return res.status(403).json({ message: 'Access denied' });
//         }
//
//         req.user = decoded;  // Attach the user info to the request
//         next();
//     } catch (error) {
//         console.error(error.message);
//         res.status(401).json({ message: 'Token is not valid' });
//     }
//
// };
//
// module.exports = authMiddleware;
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

// Middleware to verify the JWT token and user access level
const authMiddleware = (requiredAccessLevel = 'read') => async (req, res, next) => {
    const token = req.headers.authorization;  // Get the token from the header after 'Bearer'

    // Check if token is provided
    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;  // Attach decoded user info to the request object

        // Check if the user's access level matches the required one
        if (decoded.accessLevel !== 'admin' && decoded.accessLevel !== requiredAccessLevel) {
            return res.status(403).json({ message: 'Access denied, insufficient permissions' });
        }

        next();  // If token is valid and access level is sufficient, proceed to next middleware
    } catch (error) {
        console.error(error.message);
        res.status(401).json({ message: 'Token is not valid' });
    }
};

module.exports = authMiddleware;

