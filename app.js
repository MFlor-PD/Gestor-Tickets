const express = require('express');
const app = express();
require('dotenv').config();
const PORT = process.env.PORT || 3001;
const routes = require('./routes/ticketRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const cors = require('cors'); 

// CORS configurado específicamente para tu frontend
app.use(cors({
  origin: 'http://localhost:3000', // tu frontend React
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


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});