const express = require("express");
const router = express.Router();
const { createPayment, paymentSuccess } = require("../controllers/paymentController");

// Crear preferencia
router.post("/create-payment", createPayment);

// Confirmación de pago
router.get("/payment/success", paymentSuccess);

module.exports = router;
