const express = require('express');
const router = express.Router();
const { getProjects, getProjectById } = require('../controllers/projectController');
const { createProject, updateProjectStatus } = require('../controllers/adminController'); // Re-using admin controller logic??
// Wait, admin controller's createProject is in adminRoutes. 
// Standard REST pattern: 
// GET /projects (Public)
// POST /projects (Admin)
// PUT /projects/:id (Admin)

// I should probably move the Admin logic here or import it?
// adminRoutes protects everything with `protect` and `checkRole`.
// Here we want mix. 
// Option A: Keep Admin routes separate in /api/admin/projects. 
// Option B: Merge here.
// Let's stick to /api/projects being the resource.
// But specific admin actions can be imported or re-implemented.
// Actually, let's keep it simple: 
// Public routes here. 
// Admin actions are currently in `adminRoutes.js` at `/api/admin/projects`. 
// I will just add the GET routes here.

router.get('/', getProjects);
router.get('/:id', getProjectById);

module.exports = router;
