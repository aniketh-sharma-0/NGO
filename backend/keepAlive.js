const axios = require('axios');

const startKeepAlive = () => {
    // Run immediately on start
    ping();

    // Then run every 2 minutes
    setInterval(ping, 120000);
};

const ping = async () => {
    try {
        const res = await axios.get("https://ngo-x9e8.onrender.com/");
        console.log("Keep-alive success:", res.status);
    } catch (err) {
        console.log("Keep-alive failed");
    }
};

module.exports = startKeepAlive;
