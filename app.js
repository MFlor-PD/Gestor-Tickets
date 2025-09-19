const express = require('express');
const app = express();
require('dotenv').config();
const PORT = process.env.PORT || 3001;
const routes = require('./routes/ticketRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const adminRoutes = require('./routes/adminRoutes');
const cors = require('cors'); 
const dbConnection = require('./config/bbdd.js');

dbConnection();
// CORS configurado para codespaces y localhost
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://verbose-space-adventure-q7p99vp4q6wp3xqr4-3000.app.github.dev'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
})); 

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.use('/reservas', routes);
app.use('/api', paymentRoutes);
app.use('/api/admin', adminRoutes); 

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log('Frontend allowed origins:');
    console.log('- http://localhost:3000');
    console.log('- https://verbose-space-adventure-q7p99vp4q6wp3xqr4-3000.app.github.dev');
    console.log('Admin routes available at: /api/admin/*');
});