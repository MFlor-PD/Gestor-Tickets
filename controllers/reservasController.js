// controllers/reservasController.js
const { guardarReserva, eliminarReserva, listarReservas } = require("../services/reservaService");

// POST /reservas → crear
async function crearReserva(req, res) {
    try {
        const { comprador, entradas } = req.body;
        const reserva = await guardarReserva(comprador, entradas);
        res.json({ message: "Reserva creada", reserva });
    } catch (err) {
        res.status(500).json({ error: "Error al crear la reserva" });
    }
}

// DELETE /reservas/:ticket → eliminar
async function borrarReserva(req, res) {
    try {
        const { ticket } = req.params;
        const result = await eliminarReserva(ticket);
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: "Error al eliminar la reserva" });
    }
}

// GET /reservas → listar todas
async function obtenerReservas(req, res) {
    try {
        const reservas = await listarReservas();
        res.json(reservas);
    } catch (err) {
        res.status(500).json({ error: "Error al leer las reservas" });
    }
}

module.exports = { crearReserva, borrarReserva, obtenerReservas };
