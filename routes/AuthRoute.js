const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');

// Signup a new user
router.post('/signup', AuthController.signup);

// Login a user
router.post('/login', AuthController.login);

module.exports = router;