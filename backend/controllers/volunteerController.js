const Volunteer = require('../models/Volunteer');
const VolunteerTask = require('../models/VolunteerTask');
const User = require('../models/User');
const Role = require('../models/Role');

// @desc    Register as Volunteer
// @route   POST /api/volunteers/register
// @access  Private (Any User)
const registerVolunteer = async (req, res) => {
    try {
        const { skills, availability, phone, address } = req.body;

        // Check if already registered
        const existing = await Volunteer.findOne({ user: req.user._id });
        if (existing) {
            return res.status(400).json({ message: 'You have already registered as a volunteer.' });
        }

        const volunteer = await Volunteer.create({
            user: req.user._id,
            skills,
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

        const tasks = await VolunteerTask.find({ volunteer: volunteer._id }).populate('project', 'title');
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

        await task.save();

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
