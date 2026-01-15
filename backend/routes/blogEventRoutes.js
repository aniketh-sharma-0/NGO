const express = require('express');
const router = express.Router();
const { getBlogs, getEvents } = require('../controllers/blogEventController');

router.get('/blogs', getBlogs);
router.get('/events', getEvents);

module.exports = router;
