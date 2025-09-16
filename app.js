const express = require('express');
const app = express();
const PORT = 3000;
const routes = require('./routes/ticketRoutes')
const carritoRoutes = require("./routes/carritoRoutes");
const mercadoPagoRoutes = require("./routes/mercadoPagoRoutes");


app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.use('/', routes);
app.use("/carrito", carritoRoutes);
app.use("/mercadoPago", mercadoPagoRoutes);






app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});