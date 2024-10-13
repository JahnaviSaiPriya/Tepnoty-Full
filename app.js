require('dotenv').config();
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const problemRoutes = require('./routes/problemRoutes');
const statusRoutes = require('./routes/status');
const searchRoutes = require('./routes/search');
const postRoutes = require('./routes/post');
const tcRoutes = require('./routes/termsAndConditions');
const policyRoutes = require('./routes/privacyPolicy');
const deleteAccount = require('./routes/deleteUser');
const app = express();
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, process.env.UPLOADS_DIR || 'uploads')));

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB connected')) 
  .catch(err => console.error('MongoDB connection error:', err));

app.use('/api', postRoutes);
app.use('/api/auth', authRoutes); 
app.use('/api/problems', problemRoutes);
app.use('/api', statusRoutes);
app.use('/api', searchRoutes); 
app.use('/api', tcRoutes); 
app.use('/api', policyRoutes);  
app.use('/api',deleteAccount);

module.exports = app;
