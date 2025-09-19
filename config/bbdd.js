const mongoose = require('mongoose')
require('dotenv').config()

const dbConnection = async () => {
try{
await mongoose.connect(process.env.MONGO_URI)
console.log('Conexion establecida con BBDD')
} catch (err) {
console.error('Error al conectar con MongoDB:', err.message);
}
}
module.exports = dbConnection