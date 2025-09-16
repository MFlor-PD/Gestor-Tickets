const { calcularReserva } = require("../helpers/calculosHelper");
const { leerVentas, escribirVentas } = require("../model/ventasModel");

async function guardarReserva(comprador, entradas) {
    const totales = calcularReserva(entradas);
    const ticket = "TCK-" + Date.now() + "-" + Math.floor(Math.random() * 1000);

    const reserva = {
        comprador,
        entradas,
        totales: calcularReserva(entradas),
        ticket,
        fecha: new Date().toISOString()
    };

    const data = await leerVentas();
    data.push(reserva);
    await escribirVentas(data);

    return reserva;
}


async function listarReservas() {
    return await leerVentas();
}


async function eliminarReserva(ticket) {
    const data = await leerVentas();
    const index = data.findIndex(r => r.ticket === ticket);
    if (index === -1) {
        return { error: "Reserva no encontrada" };
    }

    const reservaEliminada = data.splice(index, 1)[0];
    await escribirVentas(data);

    return { message: "Reserva eliminada", reserva: reservaEliminada };
}

module.exports = { guardarReserva, eliminarReserva, listarReservas};




