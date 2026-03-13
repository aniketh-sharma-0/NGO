const Role = require('../models/Role');
const Permission = require('../models/Permission');

// Roles
const listRoles = async (req, res, next) => {
    try {
        const roles = await Role.find().populate('permissions');
        res.json(roles);
    } catch (error) {
        console.error(error);
        next(error);
    }
};

const getRole = async (req, res, next) => {
    try {
        const role = await Role.findById(req.params.id).populate('permissions');
        if (!role) return res.status(404).json({ message: 'Role not found' });
        res.json(role);
    } catch (error) {
        console.error(error);
        next(error);
    }
};

const createRole = async (req, res, next) => {
    try {
        const { name, permissions = [] } = req.body;
        const role = new Role({ name, permissions });
        await role.save();
        res.status(201).json(role);
    } catch (error) {
        console.error(error);
        next(error);
    }
};

const updateRole = async (req, res, next) => {
    try {
        const { name, permissions } = req.body;
        const role = await Role.findById(req.params.id);
        if (!role) return res.status(404).json({ message: 'Role not found' });
        if (name) role.name = name;
        if (permissions) role.permissions = permissions;
        await role.save();
        res.json(role);
    } catch (error) {
        console.error(error);
        next(error);
    }
};

const deleteRole = async (req, res, next) => {
    try {
        const role = await Role.findByIdAndDelete(req.params.id);
        if (!role) return res.status(404).json({ message: 'Role not found' });
        res.json({ message: 'Role deleted' });
    } catch (error) {
        console.error(error);
        next(error);
    }
};

// Permissions
const listPermissions = async (req, res, next) => {
    try {
        const permissions = await Permission.find();
        res.json(permissions);
    } catch (error) {
        console.error(error);
        next(error);
    }
};

const getPermission = async (req, res, next) => {
    try {
        const permission = await Permission.findById(req.params.id);
        if (!permission) return res.status(404).json({ message: 'Permission not found' });
        res.json(permission);
    } catch (error) {
        console.error(error);
        next(error);
    }
};

const createPermission = async (req, res, next) => {
    try {
        const { name, description } = req.body;
        const permission = new Permission({ name, description });
        await permission.save();
        res.status(201).json(permission);
    } catch (error) {
        console.error(error);
        next(error);
    }
};

const updatePermission = async (req, res, next) => {
    try {
        const { name, description } = req.body;
        const permission = await Permission.findById(req.params.id);
        if (!permission) return res.status(404).json({ message: 'Permission not found' });
        if (name) permission.name = name;
        if (description) permission.description = description;
        await permission.save();
        res.json(permission);
    } catch (error) {
        console.error(error);
        next(error);
    }
};

const deletePermission = async (req, res, next) => {
    try {
        const permission = await Permission.findByIdAndDelete(req.params.id);
        if (!permission) return res.status(404).json({ message: 'Permission not found' });
        res.json({ message: 'Permission deleted' });
    } catch (error) {
        console.error(error);
        next(error);
    }
};

module.exports = {
    // roles
    listRoles,
    getRole,
    createRole,
    updateRole,
    deleteRole,
    // permissions
    listPermissions,
    getPermission,
    createPermission,
    updatePermission,
    deletePermission
};
