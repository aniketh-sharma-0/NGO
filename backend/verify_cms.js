const axios = require('axios');
const fs = require('fs');

const API_URL = 'http://localhost:5000/api';

const runCMSTests = async () => {
    try {
        // 1. Login as Admin
        console.log('Logging in as Admin...');
        const loginRes = await axios.post(`${API_URL}/auth/login`, {
            email: 'admin@yrds.org',
            password: 'admin123'
        });
        const token = loginRes.data.token;
        const config = { headers: { Authorization: `Bearer ${token}` } };
        console.log('Admin Login Success');

        // 2. Update Content
        console.log('Testing Update Content...');
        const contentRes = await axios.put(`${API_URL}/admin/content`, {
            key: 'home_hero_title',
            value: 'Welcome to YRDS',
            section: 'Home'
        }, config);
        console.log('Update Content Success:', contentRes.data.value);

        // 3. Create Project
        console.log('Testing Create Project...');
        const projectRes = await axios.post(`${API_URL}/admin/projects`, {
            title: 'New School Building',
            description: 'Building a new school for village kids.',
            category: 'Education',
            budget: 500000
        }, config);
        console.log('Create Project Success:', projectRes.data.title);

        // 4. Update Project Status
        console.log('Testing Update Project Status...');
        const statusRes = await axios.put(`${API_URL}/admin/projects/${projectRes.data._id}/status`, {
            status: 'Ongoing',
            priority: 'High'
        }, config);
        console.log('Update Status Success:', statusRes.data.status);

        // 5. Get Volunteers
        console.log('Testing Get Volunteers...');
        const volRes = await axios.get(`${API_URL}/admin/volunteers`, config);
        console.log('Get Volunteers Success, count:', volRes.data.length);

        console.log('\nALL CMS TESTS PASSED');
    } catch (error) {
        if (error.response) {
            console.error('TEST FAILED:', error.response.status, error.response.data);
        } else {
            console.error('TEST FAILED:', error.message);
        }
        process.exit(1);
    }
};

runCMSTests();
