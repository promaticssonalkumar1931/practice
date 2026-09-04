const express = require('express');
const { registerUser, loginUser, getMe,logOut } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout',logOut)
router.get('/me', protect, getMe);

module.exports = router;
