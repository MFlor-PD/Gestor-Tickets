const fs = require("fs");
const path = require("path");

const VIP = 80000;
const GENERAL = 70000;

// Archivo donde se guardan las reservas
const ventasFile = path.join(__dirname, "ventas.json");

// Asegurarse de que exista el archivo
if (!fs.existsSync(ventasFile)) {
    fs.writeFileSync(ventasFile, JSON.stringify([]));
}

// Función que calcula totales de una reserva
function calcularReserva(entradas) {
    // entradas = { VIP: { Adult: n, Child: m }, GENERAL: { Adult: x, Child: y } }

    const vipAdult = (entradas.VIP?.Adult || 0) * VIP;
    const vipChild = (entradas.VIP?.Child || 0) * VIP;
    const totalVIP = vipAdult + vipChild;

    const genAdult = (entradas.GENERAL?.Adult || 0) * GENERAL;
    const genChild = (entradas.GENERAL?.Child || 0) * GENERAL;
    const totalGENERAL = genAdult + genChild;

    const totalFinal = totalVIP + totalGENERAL;

    return {
        VIP: { Adult: vipAdult, Child: vipChild, total: totalVIP },
        GENERAL: { Adult: genAdult, Child: genChild, total: totalGENERAL },
        TOTAL: totalFinal
    };
}

// Función para guardar la reserva en ventas.json
function guardarReserva(comprador, entradas) {
    const totales = calcularReserva(entradas);
    const ticket = "TCK-" + Date.now(); // ticket único

    const reserva = {
        comprador,
        entradas,
        totales,
        ticket,
        fecha: new Date().toISOString()
    };

    const data = JSON.parse(fs.readFileSync(ventasFile, "utf8"));
    data.push(reserva);
    fs.writeFileSync(ventasFile, JSON.stringify(data, null, 2));

    return reserva;
}

// EJEMPLO DE USO
const entradasEjemplo = {
    VIP: { Adult: 2, Child: 1 },
    GENERAL: { Adult: 1, Child: 0 }
};

const reservaGuardada = guardarReserva("Juan Pérez", entradasEjemplo);


// DELETE /reservas/:ticket
function eliminarReserva(ticket) {
    const data = JSON.parse(fs.readFileSync(ventasFile, "utf8"));

    const index = data.findIndex(r => r.ticket === ticket);
    if (index === -1) {
        return { error: "Reserva no encontrada" };
    }

    const reservaEliminada = data.splice(index, 1)[0]; // eliminamos la reserva
    fs.writeFileSync(ventasFile, JSON.stringify(data, null, 2));

    return { message: "Reserva eliminada", reserva: reservaEliminada };
}

// EJEMPLO DE USO:
const resultado = eliminarReserva("TCK-1758020555127");
console.log(resultado);




