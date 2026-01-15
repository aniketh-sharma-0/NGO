const Blog = require('../models/Blog');
const Event = require('../models/Event');

// @desc    Get Published Blogs
// @route   GET /api/blogs
// @access  Public
const getBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find({ published: true }).sort({ createdAt: -1 });
        res.json(blogs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get Events (Upcoming first)
// @route   GET /api/events
// @access  Public
const getEvents = async (req, res) => {
    try {
        const events = await Event.find().sort({ date: 1 }); // Ascending date
        // Separate Upcoming vs Completed if needed, for now just list all sorted by date
        // Maybe client filters? Or we filter query?
        // Let's return all.
        res.json(events);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getBlogs,
    getEvents
};
