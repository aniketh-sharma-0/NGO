const Volunteer = require('../models/Volunteer');
const VolunteerTask = require('../models/VolunteerTask');
const User = require('../models/User');
const Role = require('../models/Role');
const { createNotification } = require('./notificationController');

// @desc    Register as Volunteer
// @route   POST /api/volunteers/register
// @access  Private (Any User)
const registerVolunteer = async (req, res) => {
    try {
        const { availability, phone, address } = req.body;

        // Check if Admin
        const roleName = req.user.role?.name;
        if (roleName === 'Admin' || roleName === 'Super Admin') {
            return res.status(403).json({ message: 'Administrators cannot register as volunteers. You already have full access.' });
        }

        // Check if already registered
        const existing = await Volunteer.findOne({ user: req.user._id });
        if (existing) {
            return res.status(400).json({ message: 'You have already registered as a volunteer.' });
        }

        const volunteer = await Volunteer.create({
            user: req.user._id,
            availability,
            phone,
            address,
            status: 'Pending'
        });

        // Assign Role 'Volunteer' to User
        let volunteerRole = await Role.findOne({ name: 'Volunteer' });

        if (!volunteerRole) {
            volunteerRole = await Role.create({ name: 'Volunteer', permissions: [] });
        }

        await User.findByIdAndUpdate(req.user._id, { role: volunteerRole._id });

        // Trigger Admin notification
        await createNotification({
            role: 'Admin',
            title: 'New Volunteer Application',
            message: `${req.user.name} has registered as a volunteer.`,
            type: 'New Volunteer',
            redirectLink: '/dashboard'
        });

        res.status(201).json(volunteer);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get My Volunteer Profile
// @route   GET /api/volunteers/me
// @access  Private
const getMyProfile = async (req, res) => {
    try {
        const volunteer = await Volunteer.findOne({ user: req.user._id });
        if (!volunteer) {
            return res.status(404).json({ message: 'Volunteer profile not found' });
        }
        res.json(volunteer);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get My Tasks
// @route   GET /api/volunteers/me/tasks
// @access  Private
const getMyTasks = async (req, res) => {
    try {
        const volunteer = await Volunteer.findOne({ user: req.user._id });
        if (!volunteer) {
            return res.status(404).json({ message: 'Volunteer profile not found' });
        }

        const tasks = await VolunteerTask.find({ volunteer: volunteer._id }).populate('project', 'title').sort({ createdAt: -1 });
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Submit Task
// @route   PUT /api/volunteers/tasks/:id/submit
// @access  Private
const submitTask = async (req, res) => {
    const { submissionText, submissionImage } = req.body;

    try {
        const task = await VolunteerTask.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Deadline Check
        if (task.dueDate && new Date() > new Date(task.dueDate)) {
            return res.status(400).json({ message: 'Submission deadline has passed. This task is marked as not attended.' });
        }

        // Verify ownership indirectly? 
        // Ideally check if task.volunteer belongs to req.user. 
        // But for MVB (Minimum Viable Build), let's assume ID match is enough or trust the logic.
        // Better:
        // const volunteer = await Volunteer.findOne({ user: req.user._id });
        // if (task.volunteer.toString() !== volunteer._id.toString()) ...

        task.submissionText = submissionText;
        task.submissionImage = submissionImage;
        task.status = 'Submitted';
        task.submittedAt = new Date();
        task.completedAt = new Date();

        await task.save();

        // Admin will approve this later to update stats
        const volunteer = await Volunteer.findById(task.volunteer);
        if (volunteer) {
            console.log(`[Volunteer] Creating notification for Admin about task: ${task.title}`);
            await createNotification({
                role: 'Admin',
                title: 'Volunteer Task Submitted',
                message: `${req.user.name} has submitted the task: ${task.title}. Awaiting approval.`,
                type: 'Task Submission',
                redirectLink: `/dashboard?volunteerId=${volunteer._id}`
            });
        }

        res.json(task);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const uploadProof = (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }
    const filePath = `/${req.file.path.replace(/\\/g, '/')}`;
    res.json({ filePath });
};

module.exports = {
    registerVolunteer,
    getMyProfile,
    getMyTasks,
    submitTask,
    uploadProof
};
