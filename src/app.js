const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const authRoutes = require('./routes/authRoutes');
const accountRoutes=require('./routes/accountRoutes')
const transectionRoutes=require('./routes/transectionRoutes')
const app = express();
const cors = require('cors');

const allowedOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:4200',
  'http://127.0.0.1:4200',
  'http://localhost:4201',
  'http://127.0.0.1:4201',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:8080',
  'http://127.0.0.1:8080',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(express.json());
app.use(morgan('dev'));
app.use(cookieParser());
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-access-token', 'Cookie']
}));

app.get('/', (req, res) => {
  res.json({ message: 'Auth API is running' });
});
app.get('/',(req,res)=>{
  req.setEncoding("Ledger Services is up and running")
})
app.use('/api/auth', authRoutes);
app.use('/api/accounts',accountRoutes);
app.use('/api/transection',transectionRoutes)
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

module.exports = app;
