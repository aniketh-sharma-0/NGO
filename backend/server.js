const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/content', require('./routes/contentRoutes'));
app.use('/api/projects', require('./routes/projectRoutes'));
app.use('/api/donations', require('./routes/donationRoutes'));
app.use('/api/volunteers', require('./routes/volunteerRoutes'));
app.use('/api/media', require('./routes/blogEventRoutes'));
app.use('/api/contact', require('./routes/contactRoutes'));
app.use('/api/chat', require('./routes/chatRoutes'));
app.use('/api/security', require('./routes/securityRoutes'));

// Serve static assets (uploads)
app.use('/uploads', express.static('uploads'));

app.get('/api/health', (req, res) => {
    res.send('Server running');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
