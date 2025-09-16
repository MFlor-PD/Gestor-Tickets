const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketController');

router.post('/reservas', (req, res) => {
    const { comprador, entradas } = req.body;
    const reserva = ticketController.guardarReserva(comprador, entradas);
    res.status(201).json(reserva);
});

// DELETE /reservas/:ticket
router.delete('/reservas/:ticket', (req, res) => {
    const { ticket } = req.params;
    const resultado = ticketController.eliminarReserva(ticket);
    if (resultado.error) {
        return res.status(404).json(resultado);
    }
    res.json(resultado);
});

module.exports = router;
