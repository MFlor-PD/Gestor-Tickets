const fs = require("fs").promises;
const path = "./ventas.json";

async function leerVentas() {
    try {
        const data = await fs.readFile(path, "utf-8");
        return JSON.parse(data);
    } catch (err) {
        // Si no existe el archivo, devolvemos un array vacío
        if (err.code === "ENOENT") return [];
        throw err;
    }
}

async function escribirVentas(data) {
    await fs.writeFile(path, JSON.stringify(data, null, 2));
}

module.exports = { leerVentas, escribirVentas };









