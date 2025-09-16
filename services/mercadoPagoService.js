// services/mercadoPagoService.js
const mercadopago = require("mercadopago");

// Configurar el SDK con tu Access Token
mercadopago.configurations.setAccessToken("TU_ACCESS_TOKEN");

async function crearPreferencia(reserva) {
  const preference = {
    items: [
      {
        title: `Entradas de ${reserva.comprador}`,
        quantity: 1,
        unit_price: reserva.totales.TOTAL,
        currency_id: "ARS"
      }
    ],
    back_urls: {
      success: "http://localhost:3000/pago/exitoso",
      failure: "http://localhost:3000/pago/fallido",
      pending: "http://localhost:3000/pago/pendiente"
    },
    auto_return: "approved"
  };

  const response = await mercadopago.preferences.create(preference);
  return response.body;
}

module.exports = { crearPreferencia };
