import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
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
            if (error.response?.status !== 401) {
                console.warn("Failed to fetch unread count", error.message);
            }
        }
    }, []);

    useEffect(() => {
        fetchUnreadCount();
        const interval = setInterval(fetchUnreadCount, 15000); // Poll every 15 seconds
        return () => clearInterval(interval);
    }, [fetchUnreadCount]);

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
