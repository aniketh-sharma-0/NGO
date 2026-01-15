const express = require('express');
const router = express.Router();
const {
    getBlogs, getEvents,
    createBlog, updateBlog, deleteBlog,
    createEvent, updateEvent, deleteEvent
} = require('../controllers/blogEventController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/blogs').get(getBlogs).post(protect, admin, createBlog);
router.route('/blogs/:id').put(protect, admin, updateBlog).delete(protect, admin, deleteBlog);

router.route('/events').get(getEvents).post(protect, admin, createEvent);
router.route('/events/:id').put(protect, admin, updateEvent).delete(protect, admin, deleteEvent);

module.exports = router;
