const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// CORS configuration for production and development
const devOrigins = ['http://localhost:3000', 'http://localhost:5173'];
const envProdOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(',').map((url) => url.trim()).filter(Boolean)
  : [];

// Keep a safe production fallback so CORS works even if FRONTEND_URL is not set.
const defaultProdOrigins = [
  'https://job-application-tracker-ivory-one.vercel.app',
  'https://job-application-tracker-9b8b.vercel.app'
];

const prodOrigins = [...new Set([...envProdOrigins, ...defaultProdOrigins])];

const isAllowedVercelPreview = (origin) => {
  return /^https:\/\/job-application-tracker-[a-z0-9-]+\.vercel\.app$/i.test(origin);
};

const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = process.env.NODE_ENV === 'production' ? prodOrigins : devOrigins;

    // Allow non-browser clients or same-origin requests
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    // Allow Vercel preview deployments for this project.
    if (process.env.NODE_ENV === 'production' && isAllowedVercelPreview(origin)) {
      return callback(null, true);
    }

    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve frontend static files in production (only if built assets exist)
const distPath = path.resolve(__dirname, '..', 'frontend', 'dist');
if (process.env.NODE_ENV === 'production' && fs.existsSync(distPath)) {
  app.use(express.static(distPath));
}

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/jobs', require('./routes/jobRoutes'));
app.use('/api/interviews', require('./routes/interviewRoutes'));

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ 
    message: 'Job Application Tracker API',
    version: '1.0.0',
    status: 'Running'
  });
});

// SPA fallback - serve index.html for all non-API routes in production
if (process.env.NODE_ENV === 'production' && fs.existsSync(distPath)) {
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server (for local development)
const PORT = process.env.PORT || 5000;

// Export app for external entry points
module.exports = app;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV}`);
    });
  } catch (error) {
    console.error('❌ Startup failed: unable to initialize application');
    process.exit(1);
  }
};

// Start server
startServer();
