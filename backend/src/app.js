require("dotenv/config");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const morgan = require("morgan");

const app = express();
connectDB();

app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(cookieParser());

if (process.env.NODE_ENV !== "production") {
    app.use(morgan("dev"));
}

// Index Route
app.get("/", (_, res) => {
    return res.status(200).json({
        status: 200,
        success: true,
        message: "API is running fine.."
    })
});

// Import routes
const sessionRoutes = require('./routes/session.routes');
const questionRoutes = require('./routes/question.routes');
const informationRoutes = require('./routes/information.routes');

// Use routes
app.use('/api/sessions', sessionRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/information', informationRoutes);

// Health check endpoint
app.get('/health', (_, res) => {
    return res.status(200).json({
        status: 'healthy',
        success: false,
        timestamp: new Date().toISOString()
    });
});

module.exports = app;
