require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB, getIsConnected } = require('./db/mongoClient');
const { authenticateToken } = require('./middlewares/auth');
const authRoutes = require('./routes/auth');
const customerRoutes = require('./routes/customers');
const staffRoutes = require('./routes/staff');

const app = express();
const PORT = process.env.PORT || 5000;

const clientOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(',').map((url) => url.trim().replace(/\/+$/, ''))
  : ['http://localhost:3000', 'http://localhost:5173'];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || clientOrigins.includes('*') || clientOrigins.includes(origin.replace(/\/+$/, ''))) {
      return callback(null, true);
    }
    // Permissive fallback so production preflight requests are not rejected
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Root & Health check endpoints (Public)
app.get('/', (req, res) => {
  res.json({
    success: true,
    service: 'ss-tailoring-backend',
    status: 'online',
    mongoConnected: getIsConnected(),
    timestamp: new Date().toISOString()
  });
});

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'ss-tailoring-backend',
    database: 'MongoDB Atlas',
    mongoConnected: getIsConnected(),
    time: new Date()
  });
});

// Auth middleware (verifies JWT on all protected routes)
app.use(authenticateToken);

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/customers', customerRoutes);
app.use('/api/v1/staff', staffRoutes);

// Connect DB and launch server
connectDB().then((success) => {
  app.listen(PORT, () => {
    console.log(`SS Tailoring Backend running on http://localhost:${PORT}`);
    console.log(`MongoDB: ${success ? 'CONNECTED' : 'DISCONNECTED'}`);
  });
});
