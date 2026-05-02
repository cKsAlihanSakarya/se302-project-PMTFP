const express = require('express');
const router = express.Router();
const { getAnnouncements, createAnnouncement, updateAnnouncement, deleteAnnouncement } = require('../controllers/announcementController');
const { verifyToken, verifyAdmin } = require('../middleware/authMiddleware');

router.get('/', verifyToken, getAnnouncements);
router.post('/', verifyAdmin, createAnnouncement);
router.put('/:id', verifyAdmin, updateAnnouncement);
router.delete('/:id', verifyAdmin, deleteAnnouncement);

module.exports = router;