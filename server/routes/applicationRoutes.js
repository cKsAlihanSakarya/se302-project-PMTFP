const express = require('express');
const router = express.Router();
const { applyToProject, getProjectApplications, updateApplication } = require('../controllers/applicationController');
const { verifyToken } = require('../middleware/authMiddleware');

router.post('/', verifyToken, applyToProject);
router.get('/:project_id', verifyToken, getProjectApplications);
router.put('/:id', verifyToken, updateApplication);

module.exports = router;