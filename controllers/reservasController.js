/*const {
    guardarReserva,
    listarReservas,
    obtenerReservaPorTicket,
    eliminarReserva
} = require("../services/reservaService");

const { procesarNotificacion } = require("../services/notificacionesService"); // IMPORTAR

const path = require("path");
const fs = require("fs");

// POST /reservas → crear
async function crearReserva(req, res) {
    try {
        const { comprador, entradas } = req.body;

        const reserva = await guardarReserva(comprador, entradas);
         
        const { pdfPath } = await procesarNotificacion(reserva);
        reserva.pdfPath = pdfPath;

        res.json({ message: "Reserva creada", reserva });
    } catch (err) {
        res.status(500).json({ error: err.message || "Error al crear la reserva" });
    }
}

// GET /reservas → listar todas
async function obtenerReservas(req, res) {
    try {
        const reservas = await listarReservas();
        res.json(reservas);
    } catch (err) {
        res.status(500).json({ error: err.message || "Error al listar las reservas" });
    }
}

// GET /reservas/:ticket → obtener por ticket
async function obtenerReserva(req, res) {
    try {
        const { ticket } = req.params;
        const reserva = await obtenerReservaPorTicket(ticket);
        res.json(reserva);
    } catch (err) {
        res.status(404).json({ error: err.message || "Reserva no encontrada" });
    }
}

// DELETE /reservas/:ticket → eliminar
async function borrarReserva(req, res) {
    try {
        const { ticket } = req.params;
        const reserva = await eliminarReserva(ticket);
        res.json({ message: "Reserva eliminada", reserva });
    } catch (err) {
        res.status(404).json({ error: err.message || "Reserva no encontrada" });
    }
}


async function descargarPDF(req, res) {
    try {
        const { ticket } = req.params;
        const reserva = await obtenerReservaPorTicket(ticket);

        const pdfPath = path.join(__dirname, `../tmp/${reserva.ticket}.pdf`);

        if (!fs.existsSync(pdfPath)) {
            return res.status(404).json({ error: "PDF no encontrado" });
        }

        res.download(pdfPath, `entradas-${reserva.ticket}.pdf`);
    } catch (err) {
        res.status(500).json({ error: err.message || "Error al descargar el PDF" });
    }
}


module.exports = {
    crearReserva,
    obtenerReservas,
    obtenerReserva,
    borrarReserva,
    descargarPDF
};
*/

const path = require("path");
const fs = require("fs");
const { guardarReserva, listarReservas, obtenerReservaPorTicket, eliminarReserva } = require("../services/reservaService");
const QRCode = require("qrcode");
const PDFDocument = require("pdfkit");
const nodemailer = require("nodemailer");

// --- Helper interno: generar QR y devolver ruta de archivo ---
async function generarQRs(reserva) {
    const qrs = [];
    const dir = path.join(__dirname, "..", "tmp");
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

// --- Helper interno: generar PDF con QR ---
async function generarPDFConQRs(reserva, qrs) {
    return new Promise((resolve, reject) => {
        const dir = path.join(__dirname, "..", "tmp");
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

        const filePath = path.join(dir, `${reserva.ticket}.pdf`);
        const doc = new PDFDocument();
        const stream = fs.createWriteStream(filePath);
        doc.pipe(stream);

        doc.fontSize(20).text(`Entradas para ${reserva.comprador.nombre}`, { align: "center" });
        doc.moveDown();

        qrs.forEach((qrPath, index) => {
            doc.fontSize(14).text(`Entrada ${index + 1}`, { align: "left" });
            doc.image(qrPath, { fit: [150, 150] });
            doc.moveDown();
        });

        doc.end();
        stream.on("finish", () => resolve(filePath));
        stream.on("error", reject);
    });
}

// --- Helper interno: enviar mail ---
async function enviarMailConQR(comprador, qrs, pdfPath) {
    let transporter;

    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        // --- Producción real ---
        transporter = nodemailer.createTransport({
            service: "gmail",
            auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
        });
    } else {
        // --- Mock para desarrollo ---
        const testAccount = await nodemailer.createTestAccount();
        transporter = nodemailer.createTransport({
            host: testAccount.smtp.host,
            port: testAccount.smtp.port,
            secure: testAccount.smtp.secure,
            auth: { user: testAccount.user, pass: testAccount.pass }
        });
    }

    const attachments = [
        { filename: "entradas.pdf", path: pdfPath },
        ...qrs.map((qrPath, i) => ({ filename: `entrada${i + 1}.png`, path: qrPath }))
    ];

    const info = await transporter.sendMail({
        from: process.env.EMAIL_USER || "no-reply@example.com",
        to: comprador.email,
        subject: "Tus entradas",
        text: "Gracias por tu compra. Te enviamos tus entradas con sus QR adjuntos.",
        attachments
    });

    if (!process.env.EMAIL_USER) {
        console.log("Mail de prueba (Ethereal):", nodemailer.getTestMessageUrl(info));
    }
}

// --- Controller: crear reserva ---
async function crearReserva(req, res) {
    try {
        const { comprador, entradas } = req.body;
        const reserva = await guardarReserva(comprador, entradas);

        const qrs = await generarQRs(reserva);
        const pdfPath = await generarPDFConQRs(reserva, qrs);

        await enviarMailConQR(comprador, qrs, pdfPath);

        res.json({ message: "Reserva creada", reserva, pdfPath });
    } catch (err) {
        res.status(500).json({ error: err.message || "Error al crear la reserva" });
    }
}

// --- Otros controllers ---
async function obtenerReservas(req, res) {
    try {
        const reservas = await listarReservas();
        res.json(reservas);
    } catch (err) {
        res.status(500).json({ error: err.message || "Error al listar las reservas" });
    }
}

async function obtenerReserva(req, res) {
    try {
        const { ticket } = req.params;
        const reserva = await obtenerReservaPorTicket(ticket);
        res.json(reserva);
    } catch (err) {
        res.status(404).json({ error: err.message || "Reserva no encontrada" });
    }
}

async function borrarReserva(req, res) {
    try {
        const { ticket } = req.params;
        const reserva = await eliminarReserva(ticket);
        res.json({ message: "Reserva eliminada", reserva });
    } catch (err) {
        res.status(404).json({ error: err.message || "Reserva no encontrada" });
    }
}

// --- Descargar PDF ---
async function descargarPDF(req, res) {
    try {
        const { ticket } = req.params;
        const reserva = await obtenerReservaPorTicket(ticket);

        const pdfPath = path.join(__dirname, `../tmp/${reserva.ticket}.pdf`);
        if (!fs.existsSync(pdfPath)) return res.status(404).json({ error: "PDF no encontrado" });

        res.download(pdfPath, `entradas-${reserva.ticket}.pdf`);
    } catch (err) {
        res.status(500).json({ error: err.message || "Error al descargar el PDF" });
    }
}

module.exports = { crearReserva, obtenerReservas, obtenerReserva, borrarReserva, descargarPDF };
