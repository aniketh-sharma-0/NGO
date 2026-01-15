const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true /* Make required for local auth, handle oauth separately if needed by making sparse or validating */
    },
    role: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Role'
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    googleId: {
        type: String
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('User', userSchema);
