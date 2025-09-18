const path = require("path");
const { generarQRs } = require("../middleware/qr");
const { generarPDFConQRs } = require("../helpers/qrHelper");
const { enviarMailConQR } = require("../helpers/mailHelper");

async function procesarNotificacion(reserva) {
  // 1. Generar QR de cada entrada
  const qrs = await generarQRs(reserva);

  // 2. Generar PDF con los QR
  const pdfPath = path.join(__dirname, `../tmp/${reserva.ticket}.pdf`);
  await generarPDFConQRs(reserva, qrs, pdfPath);

  // 3. Enviar mail con QR + PDF
  await enviarMailConQR(reserva.comprador, qrs, pdfPath);

  return { qrs, pdfPath };
}

module.exports = { procesarNotificacion };
