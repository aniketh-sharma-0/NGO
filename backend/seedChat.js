const mongoose = require('mongoose');
const dotenv = require('dotenv');
const ChatIntent = require('./models/ChatIntent');

dotenv.config();

const intents = [
    {
        keywords: ['donate', 'donation', 'contribute', 'give money', 'support', 'funding'],
        question: 'How can I donate?',
        answer: 'You can donate securely via our Donation page using credit card, UPI, or bank transfer. Your contributions help us empower communities.',
        category: 'Donation'
    },
    {
        keywords: ['volunteer', 'join', 'help', 'participate', 'work with you', 'internship', 'intern'],
        question: 'How do I become a volunteer?',
        answer: 'To become a volunteer, visit our "Join as Volunteer" page, fill out the registration form, and our team will get in touch with you once reviewed.',
        category: 'Volunteer'
    },
    {
        keywords: ['mission', 'vision', 'goal', 'aim', 'purpose', 'about', 'what do you do'],
        question: 'What is your mission?',
        answer: 'Our mission is to bridge the gap between resources and those in need through sustainable initiatives in education, healthcare, and livelihood.',
        category: 'General'
    },
    {
        keywords: ['location', 'address', 'office', 'where are you', 'contact', 'phone', 'email', 'reach you'],
        question: 'Where is your office located?',
        answer: 'We are headquartered at [NGO Address]. You can find our full contact details on the Contact page.',
        category: 'General'
    },
    {
        keywords: ['tax', '80g', 'deductible', 'exemption', 'receipt'],
        question: 'Are my donations tax-deductible?',
        answer: 'Yes, all donations to our NGO are eligible for tax exemption under Section 80G of the Income Tax Act.',
        category: 'Donation'
    },
    {
        keywords: ['projects', 'work', 'activities', 'doing', 'initiatives', 'programs'],
        question: 'What projects are you working on?',
        answer: 'We work on various projects including rural education, healthcare camps, and women empowerment. Check our Projects page for more details.',
        category: 'Project'
    },
    // NEW CONVERSATIONAL INTENTS
    {
        keywords: ['hi', 'hello', 'hey', 'greetings', 'good morning', 'good evening', 'namaste'],
        question: 'Greeting',
        answer: 'Hello! I am the NGO Assistant. How can I help you today?',
        category: 'General'
    },
    {
        keywords: ['who are you', 'what are you', 'your name', 'bot', 'robot', 'ai'],
        question: 'Who are you?',
        answer: 'I am an AI assistant here to help you answer questions about our NGO, donations, and volunteering opportunities.',
        category: 'General'
    },
    {
        keywords: ['thank', 'thanks', 'cool', 'great', 'awesome', 'good job'],
        question: 'Appreciation',
        answer: 'You are welcome! Let me know if you have any other questions.',
        category: 'General'
    },
    {
        keywords: ['bye', 'goodbye', 'see you', 'exit', 'quit'],
        question: 'Goodbye',
        answer: 'Goodbye! Have a wonderful day. Thank you for visiting us.',
        category: 'General'
    },
    {
        keywords: ['help', 'support', 'human', 'agent', 'person'],
        question: 'Help',
        answer: 'I can answer most common questions. If you need specific help, please use the Contact form on our website to reach our team directly.',
        category: 'General'
    }
];

const seedChat = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ngo_db'); // Fallback specific to this user/env
        console.log('MongoDB Connected');

        // Optional: Clear existing intents to avoid duplicates or strict append?
        // Let's clear for fresh start as per "add some general FAQ" usually implies setting up the base.
        // But to be safe, I'll delete only if they match these exactly. Creating fresh is better for consistency.
        // I will clear the collection to ensure clean state for this request.
        await ChatIntent.deleteMany({});
        console.log('Cleared existing intents');

        await ChatIntent.insertMany(intents);
        console.log('Chat Intents Seeded Successfully');

        process.exit();
    } catch (error) {
        console.error('Error seeding chat:', error);
        process.exit(1);
    }
};

seedChat();
