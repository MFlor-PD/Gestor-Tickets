const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');

async function generarQRs(reserva) {
  const qrs = [];
  const dir = path.join(__dirname, '..', 'tmp');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  let contador = 0;
  for (const tipo in reserva.entradas) {
    for (const entrada of reserva.entradas[tipo]) {
      const contenido = {
        ticket: reserva.ticket,
        entrada: contador + 1,
        comprador: reserva.comprador,
        fecha: reserva.fecha,
        tipo,
        nombre: entrada.nombre
      };

      const qrPath = path.join(dir, `qr-${reserva.ticket}-${contador + 1}.png`);
      await QRCode.toFile(qrPath, JSON.stringify(contenido));
      qrs.push(qrPath);
      contador++;
    }
  }

  return qrs;
}

module.exports = { generarQRs };
