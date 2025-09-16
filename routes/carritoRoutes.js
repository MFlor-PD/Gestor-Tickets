const express = require("express");
const router = express.Router();
const { agregar, listar, eliminar, vaciar, medioPago } = require("../controllers/carritoController");

router.post("/", agregar);
router.get("/", listar);
router.delete("/:ticket", eliminar);
router.delete("/", vaciar);
router.patch("/medio-pago", medioPago);

module.exports = router;
