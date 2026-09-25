import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import { connectDB, getDBStatus } from './config/db.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import academicRoutes from './routes/academicRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import hackathonRoutes from './routes/hackathonRoutes.js';
import internshipRoutes from './routes/internshipRoutes.js';
import clubRoutes from './routes/clubRoutes.js';
import announcementRoutes from './routes/announcementRoutes.js';
import resourceRoutes from './routes/resourceRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

import { notFound, errorHandler } from './middleware/errorHandler.js';

// Load environment variables securely from .env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// System Health & Diagnostics Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    system: 'CampusOS Kernel v2.4.0',
    timestamp: new Date().toISOString(),
    database: {
      connected: getDBStatus(),
      driver: 'MongoDB Atlas / Mongoose',
    },
    uptime: Math.floor(process.uptime()) + ' seconds',
    environment: process.env.NODE_ENV || 'development',
  });
});

// Mount Module Routes
app.use('/api/auth', authRoutes);
app.use('/api/academics', academicRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/hackathons', hackathonRoutes);
app.use('/api/internships', internshipRoutes);
app.use('/api/clubs', clubRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes);

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

// Bootstrap Server & Database
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`\n==================================================`);
    console.log(`🚀 [CampusOS Server Active]: Listening on port ${PORT}`);
    console.log(`🌐 Base URL: http://localhost:${PORT}`);
    console.log(`⚡ Health Check: http://localhost:${PORT}/api/health`);
    console.log(`🛡️ JWT Security & RBAC: Enabled`);
    console.log(`==================================================\n`);
  });
};

startServer();

export default app;
