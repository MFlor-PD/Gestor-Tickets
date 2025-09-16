// services/mercadoPagoService.js
require("dotenv").config();
const { MercadoPagoConfig, Order } = require('mercadopago');

// Configurar el cliente Mercado Pago
const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN, // usa tu token real del .env
  options: { timeout: 5000 },
});

// Función para crear un "Order" con datos de reserva
async function crearPreferencia(reserva) {
  const order = new Order(client);

  const body = {
    type: "online",
    processing_mode: "automatic",
    total_amount: reserva.totales.TOTAL,
    external_reference: reserva.ticket,
    payer: {
      email: reserva.compradorEmail,
    },
    transactions: {
      payments: [
        {
          amount: reserva.totales.TOTAL,
          payment_method: {
            id: "master",
            type: "credit_card",
            token: "card_token", // en producción reemplazá con token de tarjeta real
            installments: 1,
            statement_descriptor: "Mi tienda",
          },
        },
      ],
    },
  };

  const requestOptions = {
    idempotencyKey: `ticket_${reserva.ticket}`,
  };

  const response = await order.create({ body, requestOptions });
  return response;
}

module.exports = { crearPreferencia };
