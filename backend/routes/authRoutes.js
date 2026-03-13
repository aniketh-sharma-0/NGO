const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getMe, googleLogin, forgotPassword, resetPassword, directResetPassword } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { registerValidationRules, loginValidationRules, validate } = require('../middleware/validationMiddleware');

router.post('/register', registerValidationRules(), validate, registerUser);
router.post('/login', loginValidationRules(), validate, loginUser);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:resettoken', resetPassword);
router.post('/direct-reset', directResetPassword);
router.post('/google', googleLogin);
router.get('/me', protect, getMe);

const { checkRole } = require('../middleware/roleMiddleware');
router.get('/admin-only', protect, checkRole('Admin'), (req, res) => {
    res.send('Admin access granted');
});

module.exports = router;
