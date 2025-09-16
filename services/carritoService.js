const { leerCarrito, escribirCarrito } = require("../model/carritoModel");

async function agregarAlCarrito(reserva) {
    const carrito = await leerCarrito();
    carrito.push(reserva);
    await escribirCarrito(carrito);
    return reserva;
}

async function listarCarrito() {
    return await leerCarrito();
}

async function eliminarDelCarrito(ticket) {
    const carrito = await leerCarrito();
    const index = carrito.findIndex(r => r.ticket === ticket);
    if (index === -1) return { error: "Ticket no encontrado" };
    const eliminado = carrito.splice(index, 1)[0];
    await escribirCarrito(carrito);
    return { message: "Ticket eliminado", eliminado };
}

async function vaciarCarrito() {
    await escribirCarrito([]);
    return { message: "Carrito vaciado" };
}

async function guardarMedioPago(medio) {
    const carrito = await leerCarrito();
    // Guardamos el medio de pago en cada reserva
    const carritoActualizado = carrito.map(r => ({ ...r, medioPago: medio }));
    await escribirCarrito(carritoActualizado);
    return { message: "Medio de pago guardado", medio };
}

module.exports = { agregarAlCarrito, listarCarrito, eliminarDelCarrito, vaciarCarrito, guardarMedioPago };
