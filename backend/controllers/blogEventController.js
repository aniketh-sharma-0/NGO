const Blog = require('../models/Blog');
const Event = require('../models/Event');

// @desc    Get Published Blogs
// @route   GET /api/media/blogs
// @access  Public
const getBlogs = async (req, res, next) => {
    try {
        const blogs = await Blog.find({ published: true }).sort({ createdAt: -1 });
        res.json(blogs);
    } catch (error) {
        next(error);
    }
};

// @desc    Get All Events
// @route   GET /api/media/events
// @access  Public
const getEvents = async (req, res, next) => {
    try {
        const events = await Event.find().sort({ date: 1 });
        res.json(events);
    } catch (error) {
        next(error);
    }
};

// @desc    Create a Blog
// @route   POST /api/media/blogs
// @access  Private/Admin
const createBlog = async (req, res, next) => {
    try {
        const blog = await Blog.create(req.body);
        res.status(201).json(blog);
    } catch (error) {
        next(error);
    }
};

// @desc    Update a Blog
// @route   PUT /api/media/blogs/:id
// @access  Private/Admin
const updateBlog = async (req, res, next) => {
    try {
        const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!blog) return res.status(404).json({ message: 'Blog not found' });
        res.json(blog);
    } catch (error) {
        next(error);
    }
};

// @desc    Delete a Blog
// @route   DELETE /api/media/blogs/:id
// @access  Private/Admin
const deleteBlog = async (req, res, next) => {
    try {
        const blog = await Blog.findByIdAndDelete(req.params.id);
        if (!blog) return res.status(404).json({ message: 'Blog not found' });
        res.json({ message: 'Blog removed' });
    } catch (error) {
        next(error);
    }
};

// @desc    Create an Event
// @route   POST /api/media/events
// @access  Private/Admin
const createEvent = async (req, res, next) => {
    try {
        const event = await Event.create(req.body);
        res.status(201).json(event);
    } catch (error) {
        next(error);
    }
};

// @desc    Update an Event
// @route   PUT /api/media/events/:id
// @access  Private/Admin
const updateEvent = async (req, res, next) => {
    try {
        const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!event) return res.status(404).json({ message: 'Event not found' });
        res.json(event);
    } catch (error) {
        next(error);
    }
};

// @desc    Delete an Event
// @route   DELETE /api/media/events/:id
// @access  Private/Admin
const deleteEvent = async (req, res, next) => {
    try {
        const event = await Event.findByIdAndDelete(req.params.id);
        if (!event) return res.status(404).json({ message: 'Event not found' });
        res.json({ message: 'Event removed' });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getBlogs,
    getEvents,
    createBlog,
    updateBlog,
    deleteBlog,
    createEvent,
    updateEvent,
    deleteEvent
};
