import axios from 'axios';

// Use env var or fallback. Ensure NO trailing slash.
const baseURL = (import.meta.env.VITE_API_URL || 'https://ngo-x9e8.onrender.com').replace(/\/$/, '');
// If baseURL ends with /api, remove it because our calls include /api? 
// No, server routes are mounted at /api/..., and frontend calls start with /.
// Wait, TopMarquee calls '/content/Home'. Backend is '/api/content'.
// So baseURL MUST include '/api'.
// Let's check TopMarquee again. It calls '/content/Home'.
// Server has app.use('/api/content', ...).
// So full URL needs to be https://backend/api/content/Home.
// If component calls '/content/Home', baseURL must be 'https://backend/api'.

const api = axios.create({
    baseURL: `${baseURL}/api`, // Always append /api since components call /content/...
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to include the token in headers
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor to handle errors (optional but good practice)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle global errors here (e.g., 401 Unauthorized -> Logout)
        if (error.response && error.response.status === 401) {
            // Optional: Dispatch a logout action or clear local storage
            // localStorage.removeItem('token');
            // window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;
