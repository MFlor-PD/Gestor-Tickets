import mercadopago from "../config/mercadopago"; // tu config del paso 3

export const crearPreferencia = async (req, res) => {
  try {
    const preference = {
      items: [
        {
          title: "Producto de ejemplo",
          unit_price: 1000,
          quantity: 1,
        },
      ],
      back_urls: {
        success: "http://localhost:3000/success",
        failure: "http://localhost:3000/failure",
        pending: "http://localhost:3000/pending",
      },
      auto_return: "approved", // redirige automáticamente si el pago fue aprobado
    };

    const response = await mercadopago.preferences.create(preference);
    res.json({ id: response.body.id }); // este id lo usas en el frontend
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear la preferencia" });
  }
};
