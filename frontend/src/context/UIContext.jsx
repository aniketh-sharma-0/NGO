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
                if (user.role === 'Admin') {
                    const res = await api.get('/contact/unread/count');
                    setUnreadCount(res.data.count);
                }
            }
        } catch (error) {
            console.error("Failed to fetch unread count", error);
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
