// routes/ticketRoutes.js
const express = require("express");
const router = express.Router();
const { crearReserva, borrarReserva, obtenerReservas } = require("../controllers/reservasController");

// POST /reservas → crear una reserva
router.post("/", crearReserva);

// DELETE /reservas/:ticket → eliminar una reserva
router.delete("/:ticket", borrarReserva);

// GET /reservas → obtener todas las reservas
router.get("/", obtenerReservas);

module.exports = router;
