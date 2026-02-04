require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

// 1. Conectar a la Base de Datos
connectDB();

// 2. Middlewares
app.use(cors()); // Permite que React se comunique con el Backend
app.use(express.json()); // Permite leer JSON en las peticiones (body)

// 3. Rutas
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));

// 4. Puerto y Arranque
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
});