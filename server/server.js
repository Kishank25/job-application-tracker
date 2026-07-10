const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB connected successfully');
  })
  .catch((err) => {
    console.log('❌ MongoDB connection failed:', err.message);
  });

// Import routes
const authRoutes = require('./routes/auth');
const jobApplicationRoutes = require('./routes/jobApplication');

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/applications', jobApplicationRoutes);

// Test route
app.get('/', (req, res) => {
  res.send('Job Application Tracker API is running');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});