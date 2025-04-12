const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Import routes
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const carbonCalculatorRoutes = require('./routes/carbonCalculatorRoutes');
const certificationRoutes = require('./routes/certificationRoutes');
const rewardsRoutes = require('./routes/rewardsRoutes');
const reviewRoutes = require('./routes/reviewRoutes');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/eco-travel-planner')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/calculator', carbonCalculatorRoutes);
app.use('/api/certifications', certificationRoutes);
app.use('/api/rewards', rewardsRoutes);
app.use('/api/reviews', reviewRoutes);

// Basic route for testing
app.get('/', (req, res) => {
  res.send('Eco-Travel Planner API is running');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 