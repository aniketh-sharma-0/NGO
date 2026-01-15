const PageContent = require('../models/PageContent');
const Project = require('../models/Project');
const Volunteer = require('../models/Volunteer');
const VolunteerTask = require('../models/VolunteerTask');
const logActivity = require('../utils/activityLogger');

// === CONTENT MANAGEMENT ===

// @desc    Update or Create Page Content
// @route   PUT /api/admin/content
// @access  Admin
const updatePageContent = async (req, res) => {
    const { key, value, section } = req.body;

    try {
        const content = await PageContent.findOneAndUpdate(
            { key },
            { value, section, lastUpdatedBy: req.user._id },
            { new: true, upsert: true }
        );

        // Activity Log
        await logActivity(req.user._id, 'UPDATE_CONTENT', 'PageContent', content._id, { key, section });

        res.json(content);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Upload Image
// @route   POST /api/admin/upload
// @access  Admin
const uploadImage = (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }
    const filePath = `/${req.file.path.replace(/\\/g, '/')}`; // Ensure forward slashes for URL
    res.json({ filePath });
};


// === PROJECT MANAGEMENT ===

// @desc    Create Project
// @route   POST /api/admin/projects
// @access  Admin
const createProject = async (req, res) => {
    try {
        const project = await Project.create(req.body);

        await logActivity(req.user._id, 'CREATE_PROJECT', 'Project', project._id, { title: project.title });

        res.status(201).json(project);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update Full Project
// @route   PUT /api/admin/projects/:id
// @access  Admin
const updateProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        const updatedProject = await Project.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        await logActivity(req.user._id, 'UPDATE_PROJECT', 'Project', updatedProject._id, { title: updatedProject.title });

        res.json(updatedProject);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateProjectStatus = async (req, res) => {
    const { status, priority } = req.body;

    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        project.status = status || project.status;
        project.priority = priority || project.priority;
        await project.save();

        await logActivity(req.user._id, 'UPDATE_PROJECT_STATUS', 'Project', project._id, { status, priority });

        res.json(project);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// === VOLUNTEER MANAGEMENT ===

// @desc    Get All Volunteers
// @route   GET /api/admin/volunteers
// @access  Admin
const getVolunteers = async (req, res) => {
    try {
        const volunteers = await Volunteer.find().populate('user', 'name email');
        res.json(volunteers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Verify/Approve Volunteer
// @route   PUT /api/admin/volunteers/:id/verify
// @access  Admin
const verifyVolunteer = async (req, res) => {
    const { status } = req.body; // 'Active', 'Inactive'

    try {
        const volunteer = await Volunteer.findById(req.params.id);

        if (!volunteer) {
            return res.status(404).json({ message: 'Volunteer not found' });
        }

        volunteer.status = status;
        await volunteer.save();

        await logActivity(req.user._id, 'VERIFY_VOLUNTEER', 'Volunteer', volunteer._id, { status });

        res.json(volunteer);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Assign Task to Volunteer
// @route   POST /api/admin/volunteers/:id/assign
// @access  Admin
const assignTask = async (req, res) => {
    const { title, description, projectId, dueDate } = req.body;

    try {
        const task = await VolunteerTask.create({
            volunteer: req.params.id,
            project: projectId,
            title,
            description,
            dueDate
        });

        await logActivity(req.user._id, 'ASSIGN_TASK', 'VolunteerTask', task._id, { title, volunteerId: req.params.id });

        res.status(201).json(task);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    updatePageContent,
    uploadImage,
    createProject,
    updateProject,
    updateProjectStatus,
    getVolunteers,
    verifyVolunteer,
    assignTask
};
