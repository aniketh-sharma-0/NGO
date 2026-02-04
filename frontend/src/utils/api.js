import axios from 'axios';

// Define the base URL. If VITE_API_URL is missing or empty, fallback to the production backend.
let envUrl = import.meta.env.VITE_API_URL;
// Defensive check: ensure it is a valid absolute URL (starts with http)
if (envUrl && !envUrl.startsWith('http')) {
    console.warn('Invalid VITE_API_URL (must restart with http):', envUrl, '- Falling back to default.');
    envUrl = null;
}

export const API_URL = envUrl || 'https://ngo-x9e8.onrender.com';

// Ensure we don't have double slashes if the env var ends with /
const cleanBaseURL = API_URL.replace(/\/$/, '');
console.log('Using API Base URL:', cleanBaseURL);

const api = axios.create({
    baseURL: `${cleanBaseURL}/api`,
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
