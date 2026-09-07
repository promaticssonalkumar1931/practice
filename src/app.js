const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const cors = require('cors');

require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const accountRoutes = require('./routes/accountRoutes');
const transectionRoutes = require('./routes/transectionRoutes');

const app = express();

// =======================
// CORS CONFIGURATION
// =======================
const corsOptions = {
  origin: 'http://localhost:4200',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'X-Idempotency-Key'
  ]
};

app.use(cors(corsOptions));

// =======================
// MIDDLEWARE
// =======================
app.use(express.json());
app.use(morgan('dev'));
app.use(cookieParser());

// =======================
// TEST ROUTE
// =======================
app.get('/', (req, res) => {
  res.json({
    message: 'Auth API is running'
  });
});

// =======================
// ROUTES
// =======================
app.use('/api/auth', authRoutes);

app.use('/api/accounts', accountRoutes);

app.use('/api/transection', transectionRoutes);

// =======================
// 404 HANDLER
// =======================
app.use((req, res) => {
  res.status(404).json({
    message: 'Route not found'
  });
});

module.exports = app;