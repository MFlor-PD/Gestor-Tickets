const mercadopago = require("mercadopago");
require('dotenv').config();

// Configuración del SDK de MercadoPago
mercadopago.config = {
  access_token: process.env.MERCADOPAGO_ACCESS_TOKEN
};

/**
 * Crear preferencia de pago
 * @param {Object} entradas - Objeto con entradas por tipo
 * @param {Object} comprador - Datos del comprador
 * @param {string} externalReference - Datos de reserva en JSON string
 * @returns {string} URL de pago de MercadoPago
 */
async function crearPreferencia(entradas, comprador, externalReference) {
  const items = [];

  // Convertimos entradas a items de MercadoPago
  for (const tipo in entradas) {
    for (const entrada of entradas[tipo]) {
      items.push({
        title: `${tipo} - ${entrada.nombre}`,
        quantity: 1,
        unit_price: 100, // ajusta según tu precio
        currency_id: "ARS",
      });
    }
  }

  const preference = {
    items,
    payer: {
      name: comprador.nombre,
      email: comprador.email,
      phone: {
        area_code: "11",
        number: comprador.telefono.replace(/\D/g, "")
      }
    },
    external_reference: externalReference, // <-- pasamos los datos de la reserva
    back_urls: {
      success: `${process.env.FRONTEND_URL}/payment/success`,
      failure: `${process.env.FRONTEND_URL}/payment/failure`,
      pending: `${process.env.FRONTEND_URL}/payment/pending`
    },
    auto_return: "approved"
  };

  const response = await mercadopago.preferences.create(preference);
  return response.body.init_point;
}

module.exports = { crearPreferencia };
