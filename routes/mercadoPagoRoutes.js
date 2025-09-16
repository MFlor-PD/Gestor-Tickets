const express = require("express");
const router = express.Router();
const { generarPago } = require("../controllers/mercadoPagoController");

router.post("/pago", generarPago);

module.exports = router;
