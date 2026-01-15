const express = require('express');
const router = express.Router();
const {
    updatePageContent,
    uploadImage,
    createProject,
    updateProject,
    updateProjectStatus,
    getVolunteers,
    verifyVolunteer,
    assignTask
} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { checkRole } = require('../middleware/roleMiddleware'); // Admin check
const upload = require('../middleware/uploadMiddleware');

// All routes here are protected and require Admin role
router.use(protect);
router.use(checkRole('Admin'));

// Content
router.put('/content', updatePageContent);
router.post('/upload', upload.single('image'), uploadImage);

// Projects
router.post('/projects', createProject);
router.put('/projects/:id', updateProject); // Full update
router.put('/projects/:id/status', updateProjectStatus);

// Volunteers
router.get('/volunteers', getVolunteers);
router.put('/volunteers/:id/verify', verifyVolunteer);
router.post('/volunteers/:id/assign', assignTask);

module.exports = router;
