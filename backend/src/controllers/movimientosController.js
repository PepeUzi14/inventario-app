const pool = require('../config/db');

// Obtener todos los movimientos
const getMovimientos = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT m.*, p.nombre as producto
      FROM movimientos_stock m
      LEFT JOIN productos p ON m.producto_id = p.id
      ORDER BY m.fecha DESC
    `);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Entrada de stock
const entradaStock = async (req, res) => {
  const { producto_id, cantidad } = req.body;
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query(
      'UPDATE productos SET stock = stock + $1 WHERE id = $2',
      [cantidad, producto_id]
    );
    const result = await client.query(
      'INSERT INTO movimientos_stock (producto_id, tipo, cantidad) VALUES ($1, $2, $3) RETURNING *',
      [producto_id, 'entrada', cantidad]
    );
    await client.query('COMMIT');
    res.status(201).json(result.rows[0]);
  } catch (error) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: error.message });
  } finally {
    client.release();
  }
};

// Salida de stock
const salidaStock = async (req, res) => {
  const { producto_id, cantidad } = req.body;
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const producto = await client.query(
      'SELECT stock FROM productos WHERE id = $1',
      [producto_id]
    );
    if (producto.rows[0].stock < cantidad) {
      return res.status(400).json({ error: 'Stock insuficiente' });
    }
    await client.query(
      'UPDATE productos SET stock = stock - $1 WHERE id = $2',
      [cantidad, producto_id]
    );
    const result = await client.query(
      'INSERT INTO movimientos_stock (producto_id, tipo, cantidad) VALUES ($1, $2, $3) RETURNING *',
      [producto_id, 'salida', cantidad]
    );
    await client.query('COMMIT');
    res.status(201).json(result.rows[0]);
  } catch (error) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: error.message });
  } finally {
    client.release();
  }
};

module.exports = { getMovimientos, entradaStock, salidaStock };