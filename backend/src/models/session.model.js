const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

// helper
function generateShareCode() {
    return uuidv4().substring(0, 8).toUpperCase();
}

const sessionSchema = new mongoose.Schema({
    share_code: {
        type: String,
        default: generateShareCode,
        unique: true,
        index: true,
        required: true
    },

    partner_name: {
        type: String,
        required: true,
        trim: true
    },

    age_range: {
        type: String,
        enum: ["18-24", "24-30", "30-40", "40-60"],
        required: true
    },

    created_by: {
        type: String,
        enum: ["bride", "groom"],
        required: true
    },

    bride_completed: {
        type: Boolean,
        default: false
    },

    groom_completed: {
        type: Boolean,
        default: false
    },

    bride_answers: {
        own_answers: [{ question_id: String, answer: String }],
        partner_guesses: [{ question_id: String, guessed_answer: String }],
        bonus_answers: [{ question_id: String, answer: String }]
    },

    groom_answers: {
        own_answers: [{ question_id: String, answer: String }],
        partner_guesses: [{ question_id: String, guessed_answer: String }],
        bonus_answers: [{ question_id: String, answer: String }]
    },

    ai_recommendations: {
        type: String,
        default: null
    },

    compatibility_score: {
        type: Number,
        default: null
    },
    is_paid: {
        type: Boolean,
        default: false
    },

    razorpay_order_id: {
        type: String,
        default: null
    },

    razorpay_payment_id: {
        type: String,
        default: null
    },

    razorpay_signature: {
        type: String,
        default: null
    }
}, {
    timestamps: true
});

const Session = mongoose.model("Session", sessionSchema);
module.exports = Session;
