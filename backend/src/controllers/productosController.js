const pool = require('../config/db');

// Obtener todos los productos
const getProductos = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.*, c.nombre as categoria 
      FROM productos p
      LEFT JOIN categorias c ON p.categoria_id = c.id
      ORDER BY p.id ASC
    `);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener producto por id
const getProductoById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(`
      SELECT p.*, c.nombre as categoria 
      FROM productos p
      LEFT JOIN categorias c ON p.categoria_id = c.id
      WHERE p.id = $1
    `, [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Crear producto
const createProducto = async (req, res) => {
  const { nombre, descripcion, precio, stock, categoria_id } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO productos (nombre, descripcion, precio, stock, categoria_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [nombre, descripcion, precio, stock, categoria_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Editar producto
const updateProducto = async (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion, precio, stock, categoria_id } = req.body;
  try {
    const result = await pool.query(
      'UPDATE productos SET nombre=$1, descripcion=$2, precio=$3, stock=$4, categoria_id=$5 WHERE id=$6 RETURNING *',
      [nombre, descripcion, precio, stock, categoria_id, id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Eliminar producto
const deleteProducto = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM productos WHERE id = $1', [id]);
    res.json({ mensaje: 'Producto eliminado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Buscar productos
const searchProductos = async (req, res) => {
  const { q } = req.query;
  try {
    const result = await pool.query(
      'SELECT * FROM productos WHERE nombre ILIKE $1 OR descripcion ILIKE $1',
      [`%${q}%`]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getProductos, getProductoById, createProducto, updateProducto, deleteProducto, searchProductos };