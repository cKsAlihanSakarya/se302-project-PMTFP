const express = require('express');
const router = express.Router();
const { getInstructors, sendAdvisorRequest, getAdvisorRequests, updateAdvisorRequest, getInstructorProfile, updateInstructorProfile, getAdvisingProjects } = require('../controllers/advisorController');
const { verifyToken, verifyInstructor } = require('../middleware/authMiddleware');

router.get('/', verifyToken, getInstructors);
router.post('/request', verifyToken, sendAdvisorRequest);
router.get('/requests', verifyInstructor, getAdvisorRequests);
router.put('/requests/:id', verifyInstructor, updateAdvisorRequest);
router.get('/profile', verifyInstructor, getInstructorProfile);
router.put('/profile', verifyInstructor, updateInstructorProfile);
router.get('/advising', verifyInstructor, getAdvisingProjects);

module.exports = router;