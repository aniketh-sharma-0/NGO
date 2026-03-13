const axios = require('axios');
async function test() {
    try {
        const res = await axios.get('http://localhost:3000/api/notifications');
        console.log('Status:', res.status);
        console.log('Data:', res.data);
    } catch (error) {
        console.log('Error Status:', error.response ? error.response.status : 'No Response');
        if (error.response) console.log('Error Data:', error.response.data);
    }
}
test();
