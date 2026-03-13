const { check, validationResult } = require('express-validator');

// Generic validation error handler
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

// Rules for Auth Registration
const registerValidationRules = () => {
    return [
        check('name')
            .trim()
            .notEmpty().withMessage('Name is required')
            .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters')
            .matches(/^[a-zA-Z\s]+$/).withMessage('Name can only contain letters and spaces'),
        check('email')
            .trim()
            .notEmpty().withMessage('Email is required')
            .isEmail().withMessage('Please provide a valid email')
            .normalizeEmail()
            .custom((value) => {
                const domain = value.split('@')[1]?.toLowerCase();
                const typos = { 'gmial.com': 'gmail.com', 'gmal.com': 'gmail.com', 'gmaill.com': 'gmail.com', 'gnail.com': 'gmail.com', 'yaho.com': 'yahoo.com', 'hotmial.com': 'hotmail.com', 'outlok.com': 'outlook.com' };
                if (typos[domain]) throw new Error(`Did you mean ${typos[domain]}? (Typo in "${domain}")`);
                return true;
            }),
        check('password')
            .notEmpty().withMessage('Password is required')
            .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
            .matches(/(?=.*[a-z])/).withMessage('Password must contain at least one lowercase letter')
            .matches(/(?=.*[A-Z])/).withMessage('Password must contain at least one uppercase letter')
            .matches(/(?=.*[0-9])/).withMessage('Password must contain at least one number')
            .matches(/(?=.*[!@#$%^&*])/).withMessage('Password must contain at least one special character')
    ];
};

// Rules for Auth Login
const loginValidationRules = () => {
    return [
        check('email')
            .trim()
            .notEmpty().withMessage('Email is required')
            .isEmail().withMessage('Please provide a valid email')
            .normalizeEmail()
            .custom((value) => {
                const domain = value.split('@')[1]?.toLowerCase();
                const typos = { 'gmial.com': 'gmail.com', 'gmal.com': 'gmail.com', 'gmaill.com': 'gmail.com', 'gnail.com': 'gmail.com', 'yaho.com': 'yahoo.com', 'hotmial.com': 'hotmail.com', 'outlok.com': 'outlook.com' };
                if (typos[domain]) throw new Error(`Did you mean ${typos[domain]}? (Typo in "${domain}")`);
                return true;
            }),
        check('password')
            .notEmpty().withMessage('Password is required')
    ];
};

// Rules for Contact Form
const contactValidationRules = () => {
    return [
        check('name')
            .trim()
            .notEmpty().withMessage('Name is required')
            .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters')
            .matches(/^[a-zA-Z\s]+$/).withMessage('Name can only contain letters and spaces'),
        check('email')
            .trim()
            .notEmpty().withMessage('Email is required')
            .isEmail().withMessage('Please provide a valid email')
            .normalizeEmail()
            .custom((value) => {
                const domain = value.split('@')[1]?.toLowerCase();
                const typos = { 'gmial.com': 'gmail.com', 'gmal.com': 'gmail.com', 'gmaill.com': 'gmail.com', 'gnail.com': 'gmail.com', 'yaho.com': 'yahoo.com', 'hotmial.com': 'hotmail.com', 'outlok.com': 'outlook.com' };
                if (typos[domain]) throw new Error(`Did you mean ${typos[domain]}? (Typo in "${domain}")`);
                return true;
            }),
        check('message')
            .trim()
            .notEmpty().withMessage('Message is required')
            .isLength({ min: 10, max: 1000 }).withMessage('Message must be between 10 and 1000 characters')
    ];
};

// Rules for Volunteer Registration
const volunteerValidationRules = () => {
    return [
        check('phone')
            .trim()
            .notEmpty().withMessage('Phone number is required')
            .matches(/^\+\d{1,3}\s?\d{4,14}$/).withMessage('Valid phone number with country code is required')
    ];
};

// Rules for Donation
const donationValidationRules = () => {
    return [
        check('name')
            .trim()
            .notEmpty().withMessage('Name is required')
            .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters')
            .matches(/^[a-zA-Z\s]+$/).withMessage('Name can only contain letters and spaces'),
        check('email')
            .trim()
            .notEmpty().withMessage('Email is required')
            .isEmail().withMessage('Please provide a valid email')
            .normalizeEmail()
            .custom((value) => {
                const domain = value.split('@')[1]?.toLowerCase();
                const typos = { 'gmial.com': 'gmail.com', 'gmal.com': 'gmail.com', 'gmaill.com': 'gmail.com', 'gnail.com': 'gmail.com', 'yaho.com': 'yahoo.com', 'hotmial.com': 'hotmail.com', 'outlok.com': 'outlook.com' };
                if (typos[domain]) throw new Error(`Did you mean ${typos[domain]}? (Typo in "${domain}")`);
                return true;
            }),
        check('category')
            .trim()
            .notEmpty().withMessage('Category is required')
            .isIn(['Government', 'Corporate', 'Voluntary']).withMessage('Invalid donation category')
    ];
};

module.exports = {
    validate,
    registerValidationRules,
    loginValidationRules,
    contactValidationRules,
    volunteerValidationRules,
    donationValidationRules
};
