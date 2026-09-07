import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { seedDatabase } from './database/seed.js';

import dashboardRoutes from './routes/dashboard.js';
import departmentsRoutes from './routes/departments.js';
import sustainabilityRoutes from './routes/sustainability.js';
import predictionsRoutes from './routes/predictions.js';
import scenariosRoutes from './routes/scenarios.js';
import recommendationsRoutes from './routes/recommendations.js';
import reportsRoutes from './routes/reports.js';
import risksRoutes from './routes/risks.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize & seed SQLite database
seedDatabase();

// Middleware
app.use(cors());
app.use(express.json());

// Base Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    system: 'EcoCampus Decision Engine API',
    institution: 'Chennai Institute of Technology',
    course: 'PBL Course - JAVA PROGRAMMING',
    timestamp: new Date().toISOString()
  });
});

// REST API Routes
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/departments', departmentsRoutes);
app.use('/api/sustainability', sustainabilityRoutes);
app.use('/api/predictions', predictionsRoutes);
app.use('/api/scenarios', scenariosRoutes);
app.use('/api/recommendations', recommendationsRoutes);
app.use('/api/reports', reportsRoutes);
app.use('/api/risks', risksRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

if (process.env.NODE_ENV !== 'test' && !process.env.AIS_ENV) {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`====================================================`);
    console.log(`🌿 EcoCampus Decision Engine Backend running`);
    console.log(`📍 Port: ${PORT}`);
    console.log(`🎓 Chennai Institute of Technology (Autonomous)`);
    console.log(`💻 PBL Course - JAVA PROGRAMMING`);
    console.log(`🔗 Health Check: http://localhost:${PORT}/api/health`);
    console.log(`====================================================`);
  });
}

export default app;
