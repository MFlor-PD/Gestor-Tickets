// routes/ticketRoutes.js
const express = require("express");
const router = express.Router();
const { crearReserva, borrarReserva, obtenerReservas } = require("../controllers/reservasController");

// POST /reservas → crear una reserva
router.post("/reservas", crearReserva);

// DELETE /reservas/:ticket → eliminar una reserva
router.delete("/reservas/:ticket", borrarReserva);

// GET /reservas → obtener todas las reservas
router.get("/reservas", obtenerReservas);

module.exports = router;
