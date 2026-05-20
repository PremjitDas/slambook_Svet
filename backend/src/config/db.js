require("dotenv/config");
const mongoose = require("mongoose");

async function connectDB() {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
    } catch (error) {
        process.exit(1);
    }
}

module.exports = connectDB;
