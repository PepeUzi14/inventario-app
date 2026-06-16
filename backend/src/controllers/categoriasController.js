const pool = require('../config/db');

// Obtener todas las categorías
const getCategorias = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM categorias ORDER BY id ASC');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Crear categoría
const createCategoria = async (req, res) => {
  const { nombre } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO categorias (nombre) VALUES ($1) RETURNING *',
      [nombre]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Editar categoría
const updateCategoria = async (req, res) => {
  const { id } = req.params;
  const { nombre } = req.body;
  try {
    const result = await pool.query(
      'UPDATE categorias SET nombre = $1 WHERE id = $2 RETURNING *',
      [nombre, id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Eliminar categoría
const deleteCategoria = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM categorias WHERE id = $1', [id]);
    res.json({ mensaje: 'Categoría eliminada' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getCategorias, createCategoria, updateCategoria, deleteCategoria };