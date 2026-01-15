import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * RoleRoute Wrapper
 * Protects routes based on user role.
 * 
 * @param {Array<string>} allowedRoles - Array of role names allowed to access this route
 */
const RoleRoute = ({ allowedRoles }) => {
    const { user, loading } = useAuth();

    if (loading) {
        // Show nothing or a spinner while ensuring auth state is loaded
        return <div className="h-screen flex items-center justify-center">Loading...</div>;
    }

    if (!user) {
        // Not logged in -> Login
        return <Navigate to="/login" replace />;
    }

    // Check if user's role is in the allowed list
    // user.role might be an object populated from backend (e.g. { _id: ..., name: 'Volunteer' })
    // or just an ID string if not populated. We assume populated 'name' based on typical flow.
    // Safety check: handle both string role (unlikely given schema) and object.
    const userRoleName = user.role?.name || user.role;

    if (!allowedRoles.includes(userRoleName)) {
        // Role not authorized -> Home or appropriate dashboard
        // If trying to access Admin but is Volunteer -> User Dashboard
        // If trying to access Volunteer but is Admin -> Allow? Or Redirect?
        // Strict: Redirect to Home
        console.warn(`Access denied. User role: ${userRoleName}, Allowed: ${allowedRoles}`);
        return <Navigate to="/" replace />;
    }

    // Authorized
    return <Outlet />;
};

export default RoleRoute;
