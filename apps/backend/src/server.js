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

app.use(cors());
app.use(express.json());

// Auth middleware (verifies JWT on all protected routes)
app.use(authenticateToken);

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/customers', customerRoutes);
app.use('/api/v1/staff', staffRoutes);

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'ss-tailoring-backend',
    database: 'MongoDB Atlas',
    mongoConnected: getIsConnected(),
    time: new Date()
  });
});

// Connect DB and launch server
connectDB().then((success) => {
  app.listen(PORT, () => {
    console.log(`SS Tailoring Backend running on http://localhost:${PORT}`);
    console.log(`MongoDB: ${success ? 'CONNECTED' : 'DISCONNECTED'}`);
  });
});
