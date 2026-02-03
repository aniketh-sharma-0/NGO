const express = require('express');
const router = express.Router();
const securityController = require('../controllers/securityController');
const { protect } = require('../middleware/authMiddleware');
const { checkRole } = require('../middleware/roleMiddleware');

// Require Admin role for all security management endpoints
router.use(protect, checkRole('Admin'));

// Roles
router.get('/roles', securityController.listRoles);
router.get('/roles/:id', securityController.getRole);
router.post('/roles', securityController.createRole);
router.put('/roles/:id', securityController.updateRole);
router.delete('/roles/:id', securityController.deleteRole);

// Permissions
router.get('/permissions', securityController.listPermissions);
router.get('/permissions/:id', securityController.getPermission);
router.post('/permissions', securityController.createPermission);
router.put('/permissions/:id', securityController.updatePermission);
router.delete('/permissions/:id', securityController.deletePermission);

module.exports = router;
