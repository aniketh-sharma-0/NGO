const Contact = require('../models/Contact');

// @desc    Submit Contact Form
// @route   POST /api/contact
// @access  Public
const submitContactForm = async (req, res) => {
    try {
        const { name, email, phone, subject, inquiryType, organization, message } = req.body;

        const contact = await Contact.create({
            name,
            email,
            phone,
            subject: subject || `${inquiryType} Inquiry`,
            inquiryType,
            organization,
            message
        });

        res.status(201).json({ message: 'Message sent successfully', contact });
    } catch (error) {
        console.error('Contact Form Mongoose Error:', error);
        res.status(500).json({ message: error.message, details: error });
    }
};

// @desc    Get All Messages (Admin)
// @route   GET /api/contact
// @access  Private/Admin
const getMessages = async (req, res) => {
    try {
        const messages = await Contact.find().sort({ createdAt: -1 });
        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    submitContactForm,
    getMessages
};
