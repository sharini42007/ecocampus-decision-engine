import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { seedDatabase } from './backend/database/seed.js';

import dashboardRoutes from './backend/routes/dashboard.js';
import departmentsRoutes from './backend/routes/departments.js';
import sustainabilityRoutes from './backend/routes/sustainability.js';
import predictionsRoutes from './backend/routes/predictions.js';
import scenariosRoutes from './backend/routes/scenarios.js';
import recommendationsRoutes from './backend/routes/recommendations.js';
import reportsRoutes from './backend/routes/reports.js';
import risksRoutes from './backend/routes/risks.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Initialize & seed SQLite database
  seedDatabase();

  app.use(cors());
  app.use(express.json());

  // API Health Check
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      system: 'EcoCampus Decision Engine API',
      college: 'Chennai Institute of Technology',
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

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🌿 EcoCampus Decision Engine running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
