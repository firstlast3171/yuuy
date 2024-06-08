const jwt = require('jsonwebtoken');
const config = require('../config/config');

const auth = (req, res, next) => {
    const authHeader = req.header('Authorization');

    console.log('Authorization Header:', authHeader); // Log the full authorization header

    if (!authHeader) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const token = authHeader.split(" ")[1]
    console.log('Extracted Token:', token); // Log the extracted token

    if (!token) {
        return res.status(401).json({ message: 'Authorization token format is Bearer <token>' });
    }

    try {
        const decoded = jwt.verify(token, config.jwtSecret);
        console.log('Decoded Token:', decoded); // Log the decoded token
        req.user = decoded.user;
        next();
    } catch (err) {
        console.error('Token Verification Error:', err.message); // Log the error message
        res.status(401).json({ message: 'Token is not valid', error: err });
    }
};

module.exports = auth;