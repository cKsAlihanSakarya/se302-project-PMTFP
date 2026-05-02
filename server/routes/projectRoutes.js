const express = require('express');
const router = express.Router();
const { getProjects, getProject, createProject, deleteProject } = require('../controllers/projectController');
const { verifyToken } = require('../middleware/authMiddleware');

router.get('/', verifyToken, getProjects);
router.get('/:id', verifyToken, getProject);
router.post('/', verifyToken, createProject);
router.delete('/:id', verifyToken, deleteProject);

module.exports = router;