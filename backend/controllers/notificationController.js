const Notification = require('../models/Notification');

// @desc    Get user notifications
// @route   GET /api/notifications
// @access  Private
const getNotifications = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const role = req.user.role?.name;
        
        // Fetch notifications specific to the user OR specific to their role if they are an Admin
        let query;
        if (role === 'Admin') {
            query = { $or: [{ role: 'Admin' }, { userId }] };
        } else {
            query = { userId };
        }
        
        const notifications = await Notification.find(query).sort({ createdAt: -1 }).limit(50);
        res.json(notifications);
    } catch (error) {
        console.error('Error fetching notifications:', error);
        next(error);
    }
};

// @desc    Mark notification as read
// @route   PATCH /api/notifications/:id/read
// @access  Private
const markAsRead = async (req, res, next) => {
    try {
        const notification = await Notification.findById(req.params.id);
        
        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }
        
        // Ensure that the user marking it as read is either the target user or an admin
        const userId = req.user.id;
        const role = req.user.role?.name;

        if (notification.userId && notification.userId.toString() !== userId && role !== 'Admin') {
            return res.status(403).json({ message: 'Not authorized to update this notification' });
        }
        
        notification.isRead = true;
        await notification.save();
        
        res.json({ success: true, notification });
    } catch (error) {
        console.error('Error marking notification as read:', error);
        next(error);
    }
};

// @desc    Create notification
// @route   POST /api/notifications
// @access  Private
const createNotification = async (req, res) => {
    // Check if called as express route handler
    const isExpress = req && req.body;
    const data = isExpress ? req.body : req;

    try {
        const { userId, role, title, message, type, redirectLink } = data;
        
        const notification = new Notification({
            userId,
            role,
            title,
            message,
            type: type || 'Info',
            redirectLink
        });
        
        await notification.save();
        
        if (isExpress) {
            return res.status(201).json(notification);
        }
        return notification;
    } catch (error) {
        console.error('Error creating notification:', error);
        if (isExpress) {
            res.status(500).json({ message: 'Server Error' });
        }
    }
};

module.exports = {
    getNotifications,
    markAsRead,
    createNotification
};
