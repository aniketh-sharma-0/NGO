const Role = require('../models/Role');
const Permission = require('../models/Permission');

// Roles
const listRoles = async (req, res) => {
    try {
        const roles = await Role.find().populate('permissions');
        res.json(roles);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

const getRole = async (req, res) => {
    try {
        const role = await Role.findById(req.params.id).populate('permissions');
        if (!role) return res.status(404).json({ message: 'Role not found' });
        res.json(role);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

const createRole = async (req, res) => {
    try {
        const { name, permissions = [] } = req.body;
        const role = new Role({ name, permissions });
        await role.save();
        res.status(201).json(role);
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: 'Invalid data' });
    }
};

const updateRole = async (req, res) => {
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
        res.status(400).json({ message: 'Invalid data' });
    }
};

const deleteRole = async (req, res) => {
    try {
        const role = await Role.findByIdAndDelete(req.params.id);
        if (!role) return res.status(404).json({ message: 'Role not found' });
        res.json({ message: 'Role deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Permissions
const listPermissions = async (req, res) => {
    try {
        const permissions = await Permission.find();
        res.json(permissions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

const getPermission = async (req, res) => {
    try {
        const permission = await Permission.findById(req.params.id);
        if (!permission) return res.status(404).json({ message: 'Permission not found' });
        res.json(permission);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

const createPermission = async (req, res) => {
    try {
        const { name, description } = req.body;
        const permission = new Permission({ name, description });
        await permission.save();
        res.status(201).json(permission);
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: 'Invalid data' });
    }
};

const updatePermission = async (req, res) => {
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
        res.status(400).json({ message: 'Invalid data' });
    }
};

const deletePermission = async (req, res) => {
    try {
        const permission = await Permission.findByIdAndDelete(req.params.id);
        if (!permission) return res.status(404).json({ message: 'Permission not found' });
        res.json({ message: 'Permission deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
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
