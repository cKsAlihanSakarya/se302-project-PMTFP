const express = require('express');
const router = express.Router();
const { applyToProject, getProjectApplications, updateApplication, getMyProjectsApplications, getMyOwnApplications } = require('../controllers/applicationController');
const { verifyToken } = require('../middleware/authMiddleware');

router.post('/', verifyToken, applyToProject);
router.get('/my-applications', verifyToken, getMyOwnApplications);
router.get('/:project_id', verifyToken, getProjectApplications);
router.put('/:id', verifyToken, updateApplication);
router.get('/', verifyToken, getMyProjectsApplications);

module.exports = router;