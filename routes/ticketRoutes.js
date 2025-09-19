// routes/ticketRoutes.js
const express = require("express");
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { crearReserva, borrarReserva, obtenerReservas, obtenerReserva, descargarPDF} = require("../controllers/reservasController");

// POST /reservas → crear una reserva
router.post("/", crearReserva);

// DELETE /reservas/:ticket → eliminar una reserva
router.delete("/:ticket",authMiddleware, borrarReserva);

// GET /reservas → obtener todas las reservas
router.get("/", authMiddleware, obtenerReservas);

// GET /reservas/:ticket → obtener reserva por ticket
router.get("/:ticket", obtenerReserva)

router.get("/:ticket/pdf", descargarPDF);

module.exports = router;
