const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const startKeepAlive = require('./keepAlive');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');

dotenv.config();

connectDB();

const app = express();

// Security Middleware
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(mongoSanitize());
app.use(xss());

// Rate limiting for auth routes to prevent brute force
const authLimiter = rateLimit({ 
    windowMs: 15 * 60 * 1000, 
    max: 20, 
    message: "Too many login attempts, please try again later" 
});
app.use('/api/auth/', authLimiter);

app.use(express.json());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

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

app.use('/uploads', express.static('uploads'));

app.get('/api/health', (req, res) => {
    res.send('Server running');
});

app.get("/", (req, res) => {
    res.send("Backend is running successfully 🚀");
});

// Port configuration (User requested 3000 default)
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    startKeepAlive();
});
