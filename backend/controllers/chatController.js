const ChatIntent = require('../models/ChatIntent');

// @desc    Process User Message
// @route   POST /api/chat/message
// @access  Public
const handleMessage = async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) return res.status(400).json({ reply: "Please say something." });

        const lowerMsg = message.toLowerCase();

        // 1. Fetch all intents
        // Optimization: In real app, maybe cache this or use text index.
        const intents = await ChatIntent.find();

        let bestMatch = null;
        let maxKeywords = 0;

        // 2. Simple Keyword Matching
        for (const intent of intents) {
            let matches = 0;
            for (const keyword of intent.keywords) {
                if (lowerMsg.includes(keyword.toLowerCase())) {
                    matches++;
                }
            }
            if (matches > maxKeywords) {
                maxKeywords = matches;
                bestMatch = intent;
            }
        }

        if (bestMatch) {
            res.json({ reply: bestMatch.answer });
        } else {
            res.json({ reply: "I'm not sure about that. Please contact us via the Contact page or email us at support@ngo.org." });
        }

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get All Intents (Admin)
// @route   GET /api/chat/intents
// @access  Private/Admin
const getIntents = async (req, res) => {
    try {
        const intents = await ChatIntent.find().sort({ category: 1 });
        res.json(intents);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create Intent (Admin)
// @route   POST /api/chat/intents
// @access  Private/Admin
const createIntent = async (req, res) => {
    try {
        const { keywords, question, answer, category } = req.body;
        // Ensure keywords is array
        const kwArray = Array.isArray(keywords) ? keywords : keywords.split(',').map(s => s.trim());

        const intent = await ChatIntent.create({
            keywords: kwArray,
            question,
            answer,
            category
        });
        res.status(201).json(intent);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update Intent (Admin)
// @route   PUT /api/chat/intents/:id
// @access  Private/Admin
const updateIntent = async (req, res) => {
    try {
        const { keywords, question, answer, category } = req.body;
        const kwArray = Array.isArray(keywords) ? keywords : keywords.split(',').map(s => s.trim());

        const intent = await ChatIntent.findByIdAndUpdate(req.params.id, {
            keywords: kwArray,
            question,
            answer,
            category
        }, { new: true });

        res.json(intent);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete Intent (Admin)
// @route   DELETE /api/chat/intents/:id
// @access  Private/Admin
const deleteIntent = async (req, res) => {
    try {
        await ChatIntent.findByIdAndDelete(req.params.id);
        res.json({ message: 'Intent deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    handleMessage,
    getIntents,
    createIntent,
    updateIntent,
    deleteIntent
};
