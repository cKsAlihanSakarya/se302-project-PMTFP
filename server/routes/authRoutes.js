const express = require('express');
const router = express.Router();
const { register, login, updateStudentProfile, getStudentProfile, getStudentProfileById } = require('../controllers/authController');
const { verifyToken } = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.get('/profile/me', verifyToken, getStudentProfile);
router.put('/profile/me', verifyToken, updateStudentProfile);
router.get('/profile/:id', verifyToken, getStudentProfileById);

module.exports = router;