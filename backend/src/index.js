const express = require('express');
const cors = require('cors');
require('dotenv').config();
require('./config/db');

const authRoutes = require('./routes/authRoutes');
const categoriasRoutes = require('./routes/categoriasRoutes');
const productosRoutes = require('./routes/productosRoutes');
const movimientosRoutes = require('./routes/movimientosRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/categorias', categoriasRoutes);
app.use('/api/productos', productosRoutes);
app.use('/api/movimientos', movimientosRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ mensaje: 'API Inventario funcionando ✅' });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});