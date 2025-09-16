const { agregarAlCarrito, listarCarrito, eliminarDelCarrito, vaciarCarrito, guardarMedioPago } = require("../services/carritoService");

async function agregar(req, res) {
    try {
        const reserva = req.body;
        const resultado = await agregarAlCarrito(reserva);
        res.json({ message: "Agregado al carrito", reserva: resultado });
    } catch (err) {
        res.status(500).json({ error: "Error al agregar al carrito" });
    }
}

async function listar(req, res) {
    try {
        const carrito = await listarCarrito();
        res.json(carrito);
    } catch (err) {
        res.status(500).json({ error: "Error al listar el carrito" });
    }
}

async function eliminar(req, res) {
    try {
        const { ticket } = req.params;
        const resultado = await eliminarDelCarrito(ticket);
        res.json(resultado);
    } catch (err) {
        res.status(500).json({ error: "Error al eliminar del carrito" });
    }
}

async function vaciar(req, res) {
    try {
        const resultado = await vaciarCarrito();
        res.json(resultado);
    } catch (err) {
        res.status(500).json({ error: "Error al vaciar el carrito" });
    }
}

async function medioPago(req, res) {
    try {
        const { medio } = req.body;
        const resultado = await guardarMedioPago(medio);
        res.json(resultado);
    } catch (err) {
        res.status(500).json({ error: "Error al guardar medio de pago" });
    }
}

module.exports = { agregar, listar, eliminar, vaciar, medioPago };
