// middlewares/auth.js
require('dotenv').config();

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization; // esperamos Basic auth
  if (!authHeader || !authHeader.startsWith('Basic ')) {
    return res.status(401).json({ message: 'No credentials provided' });
  }

  // Decodificar Base64: "usuario:contrasena"
  const base64Credentials = authHeader.split(' ')[1];
  const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
  const [user, psw] = credentials.split(':');

  // Comparar con las variables de entorno USER y PSW
  if (user === process.env.USER && psw === process.env.PSW) {
    return next();
  } else {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
};

module.exports = authMiddleware;
