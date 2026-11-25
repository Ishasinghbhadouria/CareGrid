const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const morgan = require('morgan');
require('dotenv').config();

const { register, metricsMiddleware } = require('./metrics');

const app = express();
const PORT = process.env.PORT || 5050;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/caregrid';

// Prevent 10-second buffering hangs when running without active DB connection
mongoose.set('bufferCommands', false);

const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:8080',
  'http://127.0.0.1:8080',
  'http://localhost:3000',
  'http://localhost',
  process.env.CLIENT_URL
].filter(Boolean);

// Middleware
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(null, true);
  },
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(metricsMiddleware);

// MongoDB Connection
let isDbConnected = false;

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 3000
    });
    isDbConnected = true;
    console.log(`✅ MongoDB Connected successfully: ${conn.connection.host}/${conn.connection.name}`);
  } catch (error) {
    isDbConnected = false;
    console.warn(`⚠️ MongoDB connection notice: ${error.message}`);
    console.log(`🛡️ CareGrid Server running cleanly with in-memory resilience enabled.`);
  }
};

connectDB();

// Prometheus Metrics Endpoint
app.get('/metrics', async (req, res) => {
  try {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
  } catch (err) {
    res.status(500).end(err.message);
  }
});

// Health Check API
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    service: 'CareGrid Healthcare Platform Backend API',
    version: '1.1.0',
    timestamp: new Date().toISOString(),
    database: {
      type: 'MongoDB',
      connected: isDbConnected
    },
    observability: {
      prometheusEndpoint: '/metrics',
      grafanaRecommendedPort: 3001
    },
    rolesSupported: ['admin', 'doctor', 'patient', 'caretaker']
  });
});

// Mount API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/appointments', require('./routes/appointmentRoutes'));
app.use('/api/records', require('./routes/recordRoutes'));
app.use('/api/queue', require('./routes/queueRoutes'));
app.use('/api/emergency', require('./routes/emergencyRoutes'));

// 404 Route Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint '${req.originalUrl}' not found on CareGrid Server.`
  });
});

// Central Error Handler
app.use((err, req, res, next) => {
  console.error('CareGrid Server Error:', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

// Start Server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`=======================================================`);
  console.log(`🏥 CAREGRID REST API SERVER STARTED`);
  console.log(`📡 URL: http://localhost:${PORT}`);
  console.log(`📊 Prometheus Metrics: http://localhost:${PORT}/metrics`);
  console.log(`📋 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`=======================================================`);
});
