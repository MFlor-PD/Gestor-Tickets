const express = require('express');
const app = express();
require('dotenv').config();

const PORT = process.env.BACKEND_PORT || 3001;
const routes = require('./routes/ticketRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const adminRoutes = require('./routes/adminRoutes');
const cors = require('cors'); 
const dbConnection = require('./config/bbdd.js');

dbConnection();

// CORS usando variables de entorno
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
})); 

app.use(express.json());

app.get('/', (req, res) => {
    res.json({
        message: '🎫 Gestor de Tickets API',
        status: 'running',
        cors_origin: process.env.FRONTEND_URL
    });
});

app.use('/reservas', routes);
app.use('/api', paymentRoutes);
app.use('/api/admin', adminRoutes); 

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL}`);
    console.log(`📡 Backend URL: ${process.env.REACT_APP_API_URL}`);
    console.log(`✅ CORS configured for: ${process.env.FRONTEND_URL}`);
    console.log('📋 Routes available:');
    console.log('   - GET  / (API info)');
    console.log('   - POST /api/admin/login');
    console.log('   - /reservas/* (Tickets)');
    console.log('   - /api/* (Payments)');
});