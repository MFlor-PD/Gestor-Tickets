const {
    guardarReserva,
    listarReservas,
    obtenerReservaPorTicket,
    eliminarReserva
} = require("../services/reservaService");

// POST /reservas → crear
async function crearReserva(req, res) {
    try {
        const { comprador, entradas } = req.body;
        const reserva = await guardarReserva(comprador, entradas);
        res.json({ message: "Reserva creada", reserva });
    } catch (err) {
        res.status(500).json({ error: err.message || "Error al crear la reserva" });
    }
}

// GET /reservas → listar todas
async function obtenerReservas(req, res) {
    try {
        const reservas = await listarReservas();
        res.json(reservas);
    } catch (err) {
        res.status(500).json({ error: err.message || "Error al listar las reservas" });
    }
}

// GET /reservas/:ticket → obtener por ticket
async function obtenerReserva(req, res) {
    try {
        const { ticket } = req.params;
        const reserva = await obtenerReservaPorTicket(ticket);
        res.json(reserva);
    } catch (err) {
        res.status(404).json({ error: err.message || "Reserva no encontrada" });
    }
}

// DELETE /reservas/:ticket → eliminar
async function borrarReserva(req, res) {
    try {
        const { ticket } = req.params;
        const reserva = await eliminarReserva(ticket);
        res.json({ message: "Reserva eliminada", reserva });
    } catch (err) {
        res.status(404).json({ error: err.message || "Reserva no encontrada" });
    }
}

module.exports = {
    crearReserva,
    obtenerReservas,
    obtenerReserva,
    borrarReserva
};
