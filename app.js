const express = require('express');
const app = express();
const PORT = 3000;
const routes = require('./routes/ticketRoutes')
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.use('/', routes);







app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});