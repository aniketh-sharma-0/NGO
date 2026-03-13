const Contact = require('../models/Contact');
const { createNotification } = require('./notificationController');

// @desc    Submit Contact Form
// @route   POST /api/contact
// @access  Public
const submitContactForm = async (req, res, next) => {
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

        // Trigger Admin notification
        await createNotification({
            role: 'Admin',
            title: 'New Contact Enquiry',
            message: `${name} has submitted a new ${inquiryType} enquiry.`,
            type: 'New Enquiry',
            redirectLink: '/dashboard'
        });

        res.status(201).json({ message: 'Message sent successfully', contact });
    } catch (error) {
        console.error('Contact Form Mongoose Error:', error);
        next(error);
    }
};

// @desc    Get All Messages (Admin)
// @route   GET /api/contact
// @access  Private/Admin
const getMessages = async (req, res, next) => {
    try {
        const messages = await Contact.find().sort({ createdAt: -1 });
        res.json(messages);
    } catch (error) {
        next(error);
    }
};

// @desc    Mark Message as Read (Admin)
// @route   PUT /api/contact/:id/read
// @access  Private/Admin
const markMessageAsRead = async (req, res, next) => {
    try {
        const contact = await Contact.findById(req.params.id);
        if (!contact) {
            return res.status(404).json({ message: 'Message not found' });
        }

        contact.status = 'Read';
        await contact.save();

        res.json({ message: 'Message marked as read', contact });
    } catch (error) {
        next(error);
    }
};

// @desc    Get Unread Message Count (Admin)
// @route   GET /api/contact/unread/count
// @access  Private/Admin
const getUnreadCount = async (req, res, next) => {
    try {
        // Find count where status is specifically 'New'
        const count = await Contact.countDocuments({ status: 'New' });
        res.json({ count });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete Message (Admin)
// @route   DELETE /api/contact/:id
// @access  Private/Admin
const deleteMessage = async (req, res, next) => {
    try {
        const contact = await Contact.findById(req.params.id);
        if (!contact) {
            return res.status(404).json({ message: 'Message not found' });
        }

        await contact.deleteOne();
        res.json({ message: 'Message removed' });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    submitContactForm,
    getMessages,
    markMessageAsRead,
    getUnreadCount,
    deleteMessage
};
