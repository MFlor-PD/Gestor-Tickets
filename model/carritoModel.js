const fs = require("fs").promises;
const path = "./carrito.json";

async function leerCarrito() {
    try {
        const data = await fs.readFile(path, "utf-8");
        return JSON.parse(data);
    } catch (err) {
        if (err.code === "ENOENT") return [];
        throw err;
    }
}

async function escribirCarrito(data) {
    await fs.writeFile(path, JSON.stringify(data, null, 2));
}

module.exports = { leerCarrito, escribirCarrito };