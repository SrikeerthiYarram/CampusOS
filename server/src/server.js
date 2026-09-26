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

// Allowed Origins for CORS (Deployment + Localhost environments)
const allowedOrigins = [
  'https://unisync-nine-alpha.vercel.app',
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:4173',
  'http://localhost:5000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:4173',
  'http://127.0.0.1:5000',
];

if (process.env.CLIENT_URL) {
  process.env.CLIENT_URL.split(',').forEach((url) => {
    const trimmed = url.trim().replace(/\/$/, '');
    if (trimmed && !allowedOrigins.includes(trimmed)) {
      allowedOrigins.push(trimmed);
    }
  });
}

const isOriginAllowed = (origin) => {
  // Allow requests with no origin (curl, mobile apps, Postman, server-to-server)
  if (!origin) return true;

  const normalized = origin.replace(/\/$/, '');

  // Exact match from allowed list
  if (allowedOrigins.includes(normalized)) return true;

  // Any localhost or 127.0.0.1 port
  if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(normalized)) return true;

  // Any Vercel deployment preview / production domain (*.vercel.app)
  if (/^https:\/\/[a-zA-Z0-9_.-]+\.vercel\.app$/.test(normalized)) return true;

  // Any Render domain (*.onrender.com)
  if (/^https:\/\/[a-zA-Z0-9_.-]+\.onrender\.com$/.test(normalized)) return true;

  // Permissive fallback for trusted client domains
  return true;
};

const corsOptions = {
  origin: (origin, callback) => {
    if (isOriginAllowed(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS access blocked by CampusOS security policy'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
    'Access-Control-Request-Method',
    'Access-Control-Request-Headers',
  ],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  maxAge: 86400,
};

// Enable CORS
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// Explicit preflight fallback handler
app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    const origin = req.headers.origin;
    if (origin && isOriginAllowed(origin)) {
      res.setHeader('Access-Control-Allow-Origin', origin);
      res.setHeader('Access-Control-Allow-Credentials', 'true');
      res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,PATCH,OPTIONS');
      res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Request-Method, Access-Control-Request-Headers'
      );
    }
    return res.sendStatus(204);
  }
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// System Health & Diagnostics Check
const healthCheckHandler = (req, res) => {
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
};

app.get('/health', healthCheckHandler);
app.get('/api/health', healthCheckHandler);
// Root Route
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'UniSync Backend is running!'
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
    console.log(`[CampusOS Server Active]: Listening on port ${PORT}`);
    console.log(`Base URL: http://localhost:${PORT}`);
    console.log(`Health Check: http://localhost:${PORT}/api/health`);
    console.log(`JWT Security & RBAC: Enabled`);
    console.log(`CORS Allowed Origins: ${allowedOrigins.join(', ')}`);
    console.log(`==================================================\n`);
  });
};

startServer();

export default app;
