const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const authRoutes = require('./routes/authRoutes');
const accountRoutes=require('./routes/accountRoutes')
const transectionRoutes=require('./routes/transectionRoutes')
const app = express();
const cors = require('cors');

const corsOptions = {
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-Idempotency-Key']
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json());
app.use(morgan('dev'));
app.use(cookieParser());


app.get('/', (req, res) => {
  res.json({ message: 'Auth API is running' });
});
app.use('/api/auth', authRoutes);
app.use('/api/accounts',accountRoutes);
app.use('/api/transection',transectionRoutes)
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

module.exports = app;
