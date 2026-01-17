const express = require('express');
const router = express.Router();
const {
    getBlogs, getEvents,
    createBlog, updateBlog, deleteBlog,
    createEvent, updateEvent, deleteEvent
} = require('../controllers/blogEventController');
const { protect } = require('../middleware/authMiddleware');
const { checkRole } = require('../middleware/roleMiddleware');

router.route('/blogs').get(getBlogs).post(protect, checkRole('Admin'), createBlog);
router.route('/blogs/:id').put(protect, checkRole('Admin'), updateBlog).delete(protect, checkRole('Admin'), deleteBlog);

router.route('/events').get(getEvents).post(protect, checkRole('Admin'), createEvent);
router.route('/events/:id').put(protect, checkRole('Admin'), updateEvent).delete(protect, checkRole('Admin'), deleteEvent);

module.exports = router;
