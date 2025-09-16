// controllers/mercadoPagoController.js
const { crearPreferencia } = require("../services/mercadoPagoService");

async function generarPago(req, res) {
  try {
    const { ticket } = req.body; // recibís ticket de la reserva
    const reserva = await obtenerReservaPorTicket(ticket); // función que busca la reserva en tu carrito
    const preference = await crearPreferencia(reserva);
    res.json({ init_point: preference.init_point }); // link para pagar
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al generar pago" });
  }
}

module.exports = { generarPago };
