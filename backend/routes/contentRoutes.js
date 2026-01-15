const express = require('express');
const router = express.Router();
const { getContentBySection } = require('../controllers/pageContentController');

router.get('/:section', getContentBySection);

module.exports = router;
