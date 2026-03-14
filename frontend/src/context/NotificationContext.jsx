import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../utils/api';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

const NotificationContext = createContext();

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const knownNotifIds = React.useRef(new Set());
    const { showToast } = useToast();

    const fetchNotifications = useCallback(async (isInitial = false) => {
        if (!user) return;
        try {
            const res = await api.get(`/notifications?t=${Date.now()}`);
            const data = res.data;
            
            setNotifications(data);
            setUnreadCount(data.filter(n => !n.isRead).length);

            // Toast Logic for new unread notifications
            if (!isInitial) {
                data.forEach(n => {
                    if (!n.isRead && !knownNotifIds.current.has(n._id)) {
                        showToast(
                            n.title || 'New Notification',
                            n.message,
                            'info',
                            n.redirectLink || '/dashboard'
                        );
                    }
                });
            }

            // Update known IDs
            data.forEach(n => knownNotifIds.current.add(n._id));
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
        }
    }, [user, showToast]);

    useEffect(() => {
        if (user) {
            fetchNotifications(true); // Initial fetch
            const interval = setInterval(() => fetchNotifications(false), 15000);
            return () => clearInterval(interval);
        } else {
            setNotifications([]);
            setUnreadCount(0);
            knownNotifIds.current.clear();
        }
    }, [user, fetchNotifications]);

    const markAsRead = async (id) => {
        try {
            await api.patch(`/notifications/${id}/read`);
            setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error('Failed to mark notification as read:', error);
        }
    };

    return (
        <NotificationContext.Provider value={{ notifications, unreadCount, fetchNotifications, markAsRead }}>
            {children}
        </NotificationContext.Provider>
    );
};
