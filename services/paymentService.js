const { MercadoPagoConfig, Preference } = require('mercadopago');
require('dotenv').config();

// Configuración del SDK de MercadoPago (nueva versión)
const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN
});

/**
 * Crear preferencia de pago
 * @param {Array} entradas - Array con entradas
 * @param {Object} comprador - Datos del comprador
 * @param {string} externalReference - Datos de reserva en JSON string
 * @returns {string} URL de pago de MercadoPago
 */
async function crearPreferencia(entradas, comprador, externalReference) {
  const preference = new Preference(client);
  
  const items = [];

  // Iterar directamente sobre el array de entradas
  for (const entrada of entradas) {
    items.push({
      title: `Entrada ${entrada.tipo}`,
      quantity: entrada.cantidad,
      unit_price: entrada.precio_unitario,
      currency_id: "ARS",
    });
  }

  const preferenceData = {
    items,
    payer: {
      name: comprador.nombre,
      email: comprador.email,
      phone: {
        area_code: "11",
        number: comprador.telefono.replace(/\D/g, "")
      }
    },
    external_reference: externalReference,
    back_urls: {
      success: `${process.env.FRONTEND_URL}/payment/success`,
      failure: `${process.env.FRONTEND_URL}/payment/failure`, 
      pending: `${process.env.FRONTEND_URL}/payment/pending`
    },
    auto_return: "approved"
  };

  const response = await preference.create({ body: preferenceData });
  return response.init_point;
}

module.exports = { crearPreferencia };