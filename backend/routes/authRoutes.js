const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getMe, googleLogin } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/google', googleLogin);
router.get('/me', protect, getMe);

const { checkRole } = require('../middleware/roleMiddleware');
router.get('/admin-only', protect, checkRole('Admin'), (req, res) => {
    res.send('Admin access granted');
});

module.exports = router;
