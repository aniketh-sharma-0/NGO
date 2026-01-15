const ActivityLog = require('../models/ActivityLog');

const logActivity = async (userId, action, resource, resourceId = null, details = {}) => {
    try {
        await ActivityLog.create({
            user: userId,
            action,
            resource,
            resourceId,
            details,
            ipAddress: '127.0.0.1' // In real app, extract from req
        });
    } catch (error) {
        console.error('Activity Log Error:', error);
    }
};

module.exports = logActivity;
