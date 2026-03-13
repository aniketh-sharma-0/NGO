const express = require('express');
const router = express.Router();
const { registerVolunteer, getMyProfile, getMyTasks, submitTask, uploadProof } = require('../controllers/volunteerController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const { volunteerValidationRules, validate } = require('../middleware/validationMiddleware');

router.use(protect); // All routes require login

router.post('/register', volunteerValidationRules(), validate, registerVolunteer);
router.get('/me', getMyProfile);
router.get('/me/tasks', getMyTasks);
router.put('/tasks/:id/submit', submitTask);
router.post('/upload', upload.single('image'), uploadProof);

module.exports = router;
