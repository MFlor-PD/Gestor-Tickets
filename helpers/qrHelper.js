const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

async function generarPDFConQRs(reserva, qrs) {
  return new Promise((resolve, reject) => {
    // --- Crear carpeta tmp si no existe ---
    const dir = path.join(__dirname, '..', 'tmp');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // --- Ruta del PDF ---
    const filePath = path.join(dir, `${reserva.ticket}.pdf`);

    // --- Crear PDF ---
    const doc = new PDFDocument();
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    doc.fontSize(20).text(`Entradas para ${reserva.comprador.nombre}`, { align: 'center' });
    doc.moveDown();

    // --- Agregar cada QR desde su archivo PNG ---
    qrs.forEach((qrPath, index) => {
      doc.fontSize(14).text(`Entrada ${index + 1}`, { align: 'left' });
      doc.image(qrPath, { fit: [150, 150] });
      doc.moveDown();
    });

    doc.end();

    stream.on('finish', () => resolve(filePath));
    stream.on('error', reject);
  });
}

module.exports = { generarPDFConQRs };
