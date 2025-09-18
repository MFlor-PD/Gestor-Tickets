const { crearPreferencia } = require("../services/paymentService");
const { guardarReserva } = require("../services/reservaService");

// POST /api/create-payment
async function createPayment(req, res) {
  try {
    const { comprador, entradas } = req.body;

    // Convertimos los datos a string para pasar por external_reference
    const externalReference = JSON.stringify({ comprador, entradas });

    const paymentUrl = await crearPreferencia(entradas, comprador, externalReference);

    res.json({ success: true, paymentUrl });
  } catch (err) {
    res.status(500).json({ error: err.message || "Error al crear la preferencia" });
  }
}

// GET /api/payment/success
async function paymentSuccess(req, res) {
  try {
    const { payment_id, status, external_reference } = req.query;

    if (!external_reference) {
      return res.status(400).json({ error: "Faltan datos de la reserva" });
    }

    // Reconstruimos los datos del comprador y entradas desde external_reference
    const { comprador, entradas } = JSON.parse(external_reference);

    // Guardamos la reserva en la base de datos
    const reserva = await guardarReserva(comprador, entradas);

    // Redirigimos al frontend con info de confirmación
    res.redirect(`${process.env.FRONTEND_URL}/payment/confirmation?ticket=${reserva.ticket}&status=${status}`);
  } catch (err) {
    res.status(500).json({ error: err.message || "Error en confirmación de pago" });
  }
}

module.exports = { createPayment, paymentSuccess };

