const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

// Middleware to verify the JWT token and user access level
const authMiddleware = (requiredAccessLevel = 'read') => async (req, res, next) => {
    // console.log(req.headers);
    // console.log(req.headers.authorization);
    // const token = req.headers['authorization']?.split(' ')[1];  // Get the token from the header
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;

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
// Middleware to verify user access level without using token
// const authMiddleware = (requiredAccessLevel = 'read') => (req, res, next) => {
//     try {
//         // Lấy thông tin quyền truy cập từ req.headers
//         const accessLevel = req.headers['access-level']; // Hoặc từ req.body, req.query, tùy theo cách bạn muốn
//
//         if (!accessLevel) {
//             return res.status(401).json({ message: 'Access level not provided, authorization denied' });
//         }
//
//         // Kiểm tra quyền truy cập
//         const validAccessLevels = ['read', 'write', 'admin'];
//         if (!validAccessLevels.includes(accessLevel)) {
//             return res.status(403).json({ message: 'Invalid access level' });
//         }
//
//         if (accessLevel !== 'admin' && accessLevel !== requiredAccessLevel) {
//             return res.status(403).json({ message: 'Access denied' });
//         }
//
//         // Thêm thông tin quyền vào req để sử dụng tiếp trong các middleware khác (nếu cần)
//         req.user = { accessLevel };
//         next();
//     } catch (error) {
//         console.error(error.message);
//         res.status(500).json({ message: 'Server error' });
//     }
// };
//
// module.exports = authMiddleware;
