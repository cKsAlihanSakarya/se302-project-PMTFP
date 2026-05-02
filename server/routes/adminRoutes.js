const express = require('express');
const router = express.Router();
const { getUsers, changeUserRole, deactivateUser, getStats } = require('../controllers/adminController');
const { verifyAdmin } = require('../middleware/authMiddleware');

router.get('/users', verifyAdmin, getUsers);
router.put('/users/:id/role', verifyAdmin, changeUserRole);
router.delete('/users/:id', verifyAdmin, deactivateUser);
router.get('/stats', verifyAdmin, getStats);

module.exports = router;