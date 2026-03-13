const PageContent = require('../models/PageContent');

// @desc    Get Page Content by Key or Section
// @route   GET /api/content/:section
// @access  Public
const getContentBySection = async (req, res, next) => {
    const { section } = req.params;

    try {
        const contents = await PageContent.find({ section });
        // Return object with key-value pairs for easier frontend usage
        const contentMap = {};
        contents.forEach(item => {
            contentMap[item.key] = item.value;
        });
        res.json(contentMap);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getContentBySection
};
