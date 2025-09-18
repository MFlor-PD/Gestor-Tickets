/*const nodemailer = require('nodemailer');

async function enviarMailConQR(comprador, qrs, pdfPath) {
  const transporter = nodemailer.createTransport({
    service: 'gmail', // o el que uses
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  let attachments = [
    { filename: 'entradas.pdf', path: pdfPath }
  ];

  // También adjuntamos los QR como imágenes
  qrs.forEach((qr, i) => {
    attachments.push({
      filename: `entrada${i + 1}.png`,
      content: qr.split("base64,")[1],
      encoding: "base64"
    });
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: comprador.email,
    subject: "Tus entradas",
    text: "Gracias por tu compra. Te enviamos tus entradas con sus QR adjuntos.",
     attachments: [
    { filename: 'entradas.pdf', path: pdfPath },
    ...qrs.map((qr, i) => ({
      filename: `entrada${i+1}.png`,
      content: qr.split("base64,")[1],
      encoding: "base64"
    }))
  ]
});
}
module.exports = { enviarMailConQR }*/


const nodemailer = require('nodemailer');

async function enviarMailConQR(comprador, qrs, pdfPath) {
  // --- CAMBIO: usamos Ethereal para testing, no Gmail real ---
  const testAccount = await nodemailer.createTestAccount();

  const transporter = nodemailer.createTransport({
    host: testAccount.smtp.host,       // CAMBIO
    port: testAccount.smtp.port,       // CAMBIO
    secure: testAccount.smtp.secure,   // CAMBIO
    auth: {
      user: testAccount.user,          // CAMBIO
      pass: testAccount.pass           // CAMBIO
    }
  });

  let attachments = [
    { filename: 'entradas.pdf', path: pdfPath },
    ...qrs.map((qr, i) => ({
      filename: `entrada${i+1}.png`,
      content: qr.split("base64,")[1],
      encoding: "base64"
    }))
  ];

  const info = await transporter.sendMail({
    from: '"Test" <test@example.com>',  // CAMBIO: remitente de prueba
    to: comprador.email,
    subject: "Tus entradas",
    text: "Este es un test. Aquí van tus entradas.",
    attachments
  });

  // --- CAMBIO: mostramos link de previsualización en consola ---
  console.log("Preview URL:", nodemailer.getTestMessageUrl(info));

  return info; // opcional, para test
}

module.exports = { enviarMailConQR };
