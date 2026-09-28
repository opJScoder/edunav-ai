const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { CLIENT_URL } = require('./config/env');
const errorHandler = require('./middleware/errorHandler');

// Import routes
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const skillsRoutes = require('./routes/skillsRoutes');
const careersRoutes = require('./routes/careersRoutes');
const skillGapRoutes = require('./routes/skillGapRoutes');
const roadmapRoutes = require('./routes/roadmapRoutes');
const projectsRoutes = require('./routes/projectsRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const goalsRoutes = require('./routes/goalsRoutes');
const progressRoutes = require('./routes/progressRoutes');

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: CLIENT_URL,
  credentials: true,
}));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'PATHFORGE AI API is running',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      profile: '/api/profile',
      skills: '/api/skills',
      careers: '/api/careers',
      skillGap: '/api/skill-gap',
      roadmap: '/api/roadmap',
      projects: '/api/projects',
      dashboard: '/api/dashboard',
      goals: '/api/goals',
      progress: '/api/progress',
    },
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/skills', skillsRoutes);
app.use('/api/careers', careersRoutes);
app.use('/api/skill-gap', skillGapRoutes);
app.use('/api/roadmap', roadmapRoutes);
app.use('/api/projects', projectsRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/goals', goalsRoutes);
app.use('/api/progress', progressRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    error: 'NOT_FOUND',
  });
});

// Error handler
app.use(errorHandler);

module.exports = app;
