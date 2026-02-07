require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

// Conexión a BD
connectDB();

// Middlewares
app.use(cors()); 
app.use(express.json());

// --- REGISTRO DE RUTAS ---
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));

/** * CORRECCIÓN: Esta línea faltaba. 
 * Sin ella, cualquier petición a /api/users da Error 404.
 */
app.use('/api/users', require('./routes/userRoutes')); 

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
});