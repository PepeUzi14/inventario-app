const pool = require('../config/db');

const getDashboard = async (req, res) => {
  try {
    // Total de productos
    const totalProductos = await pool.query(
      'SELECT COUNT(*) FROM productos'
    );

    // Productos con bajo stock (menos de 5)
    const bajoStock = await pool.query(
      'SELECT COUNT(*) FROM productos WHERE stock > 0 AND stock < 5'
    );

    // Productos agotados
    const agotados = await pool.query(
      'SELECT COUNT(*) FROM productos WHERE stock = 0'
    );

    // Movimientos recientes
    const movimientosRecientes = await pool.query(`
      SELECT m.*, p.nombre as producto
      FROM movimientos_stock m
      LEFT JOIN productos p ON m.producto_id = p.id
      ORDER BY m.fecha DESC
      LIMIT 10
    `);

    // Productos con bajo stock detalle
    const productosBajoStock = await pool.query(`
      SELECT p.*, c.nombre as categoria
      FROM productos p
      LEFT JOIN categorias c ON p.categoria_id = c.id
      WHERE p.stock < 5
      ORDER BY p.stock ASC
    `);

    res.json({
      totalProductos: parseInt(totalProductos.rows[0].count),
      bajoStock: parseInt(bajoStock.rows[0].count),
      agotados: parseInt(agotados.rows[0].count),
      movimientosRecientes: movimientosRecientes.rows,
      productosBajoStock: productosBajoStock.rows
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getDashboard };