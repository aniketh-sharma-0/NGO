import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for token in localStorage
        const token = localStorage.getItem('token');
        const userStored = localStorage.getItem('user');

        if (token && userStored) {
            setUser(JSON.parse(userStored));
            // Optional: Verify token with backend
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            // Replace with your actual backend URL
            const { data } = await api.post('/auth/login', { email, password });

            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data));
            setUser(data);
            return { success: true, user: data };
        } catch (error) {
            console.error("Login Error Details:", error);
            if (error.code === "ERR_NETWORK") {
                return { success: false, message: "Network Error: Cannot connect to server. Check internet or server status." };
            }
            return {
                success: false,
                message: error.response?.data?.message || 'Login failed'
            };
        }
    };

    const register = async (name, email, password) => {
        try {
            const { data } = await api.post('/auth/register', { name, email, password });
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data));
            setUser(data);
            return { success: true };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Registration failed'
            };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    const googleAuth = async (token) => {
        try {
            const { data } = await api.post('/auth/google', { token });
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data));
            setUser(data);
            return { success: true, user: data };
        } catch (error) {
            console.error("Google Auth Error:", error);
            return {
                success: false,
                message: error.response?.data?.message || 'Google login failed'
            };
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, googleAuth, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
