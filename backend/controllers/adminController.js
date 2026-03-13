const PageContent = require('../models/PageContent');
const Project = require('../models/Project');
const Volunteer = require('../models/Volunteer');
const VolunteerTask = require('../models/VolunteerTask');
const logActivity = require('../utils/activityLogger');
const { createNotification } = require('./notificationController');

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
        const volunteers = await Volunteer.find().populate('user', 'name email').lean();
        
        const volunteersWithStats = await Promise.all(volunteers.map(async (vol) => {
            const allTasks = await VolunteerTask.find({ volunteer: vol._id }).lean();
            
            const approvedTasks = allTasks.filter(t => ['Approved', 'Completed'].includes(t.status));
            const pendingSubmissions = allTasks.filter(t => t.status === 'Submitted').length;
            
            const totalHours = approvedTasks.reduce((sum, task) => {
                const h = task.assignedHours !== undefined ? task.assignedHours : 1;
                return sum + (Number(h) || 0);
            }, 0);
            
            return {
                ...vol,
                totalHours,
                completedTasks: approvedTasks.length,
                pendingSubmissions
            };
        }));

        res.json(volunteersWithStats);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Verify/Approve Volunteer
// @route   PUT /api/admin/volunteers/:id/verify
// @access  Admin
const verifyVolunteer = async (req, res) => {
    const { status } = req.body; // 'Approved', 'Rejected'

    try {
        const volunteer = await Volunteer.findById(req.params.id);

        if (!volunteer) {
            return res.status(404).json({ message: 'Volunteer not found' });
        }

        volunteer.status = status;
        await volunteer.save();

        await logActivity(req.user._id, 'VERIFY_VOLUNTEER', 'Volunteer', volunteer._id, { status });

        // Trigger Volunteer notification
        await createNotification({
            userId: volunteer.user,
            title: `Volunteer Application ${status}`,
            message: `Your volunteer application has been ${status.toLowerCase()}.`,
            type: 'Volunteer Status',
            redirectLink: '/volunteer/dashboard'
        });

        res.json(volunteer);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Assign Task to Volunteer
// @route   POST /api/admin/volunteers/:id/assign
// @access  Admin
const assignTask = async (req, res) => {
    const { title, description, projectId, dueDate, assignedHours } = req.body;

    try {
        const task = await VolunteerTask.create({
            volunteer: req.params.id,
            project: projectId,
            title,
            description,
            dueDate,
            assignedHours,
            createdByAdmin: req.user._id,
            status: 'Pending'
        });

        await logActivity(req.user._id, 'ASSIGN_TASK', 'VolunteerTask', task._id, { title, volunteerId: req.params.id });

        // Trigger Volunteer notification
        const volunteer = await Volunteer.findById(req.params.id);
        if (volunteer) {
            await createNotification({
                userId: volunteer.user,
                title: 'New Task Assigned',
                message: `You have been assigned a new task: ${title}`,
                type: 'Task Assigned',
                redirectLink: '/volunteer/dashboard'
            });
        }

        res.status(201).json(task);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get Volunteer Tasks
// @route   GET /api/admin/volunteers/:id/tasks
// @access  Admin
const getVolunteerTasks = async (req, res) => {
    try {
        console.log(`[Admin] Fetching tasks for volunteer ID: ${req.params.id}`);
        const tasks = await VolunteerTask.find({ volunteer: req.params.id }).populate('project', 'title').sort({ createdAt: -1 });
        console.log(`[Admin] Found ${tasks.length} tasks for volunteer: ${req.params.id}`);
        res.json(tasks);
    } catch (error) {
        console.error(`[Admin] Error fetching volunteer tasks for ID ${req.params.id}:`, error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update Volunteer Task Status (Approve/Reject)
// @route   PUT /api/admin/volunteers/tasks/:taskId/status
// @access  Admin
const updateTaskStatus = async (req, res) => {
    const { status, feedback } = req.body; // 'Approved', 'Rejected'

    try {
        const task = await VolunteerTask.findById(req.params.taskId);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        task.status = status;
        if (feedback) task.feedback = feedback;
        if (status === 'Approved') task.completedAt = new Date();
        
        await task.save();

        // RE-CALCULATE AND SYNC STATS IMMEDIATELY
        const volunteerTasks = await VolunteerTask.find({ 
            volunteer: task.volunteer, 
            status: { $in: ['Approved', 'Completed'] } 
        });
        
        const totalHours = volunteerTasks.reduce((sum, t) => sum + (Number(t.assignedHours) || 0), 0);
        const completedTasks = volunteerTasks.length;

        const volunteer = await Volunteer.findById(task.volunteer);
        if (volunteer) {
            console.log(`[Admin] Updating stats for volunteer ${volunteer._id} after task verification: Hours=${totalHours}, Tasks=${completedTasks}`);
            volunteer.totalHours = totalHours;
            volunteer.completedTasks = completedTasks;
            await volunteer.save();

            // Trigger Notification for Volunteer
            await createNotification({
                userId: volunteer.user,
                title: `Task Submission ${status}`,
                message: `Your submission for task "${task.title}" has been ${status.toLowerCase()}.`,
                type: 'Task Status',
                redirectLink: '/volunteer/dashboard'
            });
        }

        await logActivity(req.user._id, 'VERIFY_TASK', 'VolunteerTask', task._id, { status });

        res.json(task);
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
    assignTask,
    getVolunteerTasks,
    updateTaskStatus
};
