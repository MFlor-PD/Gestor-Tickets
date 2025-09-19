import mercadopago from "mercadopago";
const dotenv = require("dotenv");
dotenv.config();

// Reemplaza con tu Access Token de PRUEBA
mercadopago.configure({
  access_token: process.env.MERCADOPAGO_ACCESS_TOKEN || "",
});

export default mercadopago;
