const Project = require('../models/Project');

// @desc    Get all Projects (with filters)
// @route   GET /api/projects
// @access  Public
const getProjects = async (req, res) => {
    try {
        const { category, status } = req.query;
        let query = {};

        if (category) query.category = category;
        if (status) query.status = status;

        // Custom sort order for Status: Upcoming -> Ongoing -> Completed
        // MongoDB doesn't do custom enum sort easily without aggregation.
        // Simple approach: Fetch all and sort in JS if pagination not heavy, 
        // OR use a numeric priority field.
        // Let's rely on standard sort for now, or fetch and sort.
        // "Show Upcoming first". Upcoming > Ongoing > Completed.

        let projects = await Project.find(query).sort({ updatedAt: -1 }); // Default recent first

        // Manual Sort for Status
        const statusOrder = { 'Upcoming': 1, 'Ongoing': 2, 'Completed': 3 };
        projects.sort((a, b) => {
            return (statusOrder[a.status] || 99) - (statusOrder[b.status] || 99);
        });

        res.json(projects);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get Single Project
// @route   GET /api/projects/:id
// @access  Public
const getProjectById = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (project) {
            res.json(project);
        } else {
            res.status(404).json({ message: 'Project not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getProjects,
    getProjectById
};
