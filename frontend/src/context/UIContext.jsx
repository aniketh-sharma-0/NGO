import React, { createContext, useContext, useState, useCallback } from 'react';
import api from '../utils/api';

const UIContext = createContext();

export const UIProvider = ({ children }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);

    const fetchUnreadCount = useCallback(async () => {
        try {
            const token = localStorage.getItem('token');
            const userStr = localStorage.getItem('user');
            if (token && userStr) {
                const user = JSON.parse(userStr);
                if (user.role?.name === 'Admin' || user.role === 'Admin') {
                    const res = await api.get('/contact/unread/count');
                    setUnreadCount(res.data.count);
                }
            }
        } catch (error) {
            // Silence 401s as they are handled by the API interceptor
            if (error.response?.status !== 401) {
                console.warn("Failed to fetch unread count", error.message);
            }
        }
    }, []);

    return (
        <UIContext.Provider value={{
            isMobileMenuOpen, setIsMobileMenuOpen,
            unreadCount, setUnreadCount, fetchUnreadCount
        }}>
            {children}
        </UIContext.Provider>
    );
};

export const useUI = () => useContext(UIContext);
