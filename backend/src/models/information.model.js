const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const informationSchema = new Schema({
    fullName: {
        type: String,
        required: true
    },
    partnerName: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    guestCount: {
        type: Number,
        required: true
    },
    budget: {
        type: String,
        required: true
    },
}, {
    timestamps: true
});

const Information = mongoose.model("Information", informationSchema);
module.exports = Information;
