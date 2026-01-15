const Role = require('../models/Role');
const Permission = require('../models/Permission');

// Check if user has a specific role
const checkRole = (roleName) => {
    return (req, res, next) => {
        if (!req.user || !req.user.role) {
            return res.status(401).json({ message: 'Unauthorized: No role assigned' });
        }

        if (req.user.role.name === roleName || req.user.role.name === 'Admin') { // Admin always has access
            next();
        } else {
            res.status(403).json({ message: `Forbidden: Requires ${roleName} role` });
        }
    };
};

// Check if user has a specific permission
const checkPermission = (permissionName) => {
    return async (req, res, next) => {
        if (!req.user || !req.user.role) {
            return res.status(401).json({ message: 'Unauthorized: No role assigned' });
        }

        try {
            // Role is already populated in req.user by authMiddleware, BUT we need deep population for permissions
            // Or we can just fetch the role with permissions here if not populated.
            // Let's assume authMiddleware populates 'role' but maybe not 'role.permissions'.
            // To be safe, let's fetch the role with permissions.

            const role = await Role.findById(req.user.role._id).populate('permissions');

            if (!role) {
                return res.status(401).json({ message: 'Unauthorized: Role not found' });
            }

            const hasPermission = role.permissions.some(p => p.name === permissionName);

            // Admin bypass
            if (role.name === 'Admin' || hasPermission) {
                next();
            } else {
                res.status(403).json({ message: `Forbidden: Requires ${permissionName} permission` });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server Error Checking Permissions' });
        }
    };
};

module.exports = { checkRole, checkPermission };
