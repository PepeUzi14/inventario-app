const express = require('express');
const router = express.Router();
const { getCategorias, createCategoria, updateCategoria, deleteCategoria } = require('../controllers/categoriasController');
const { verificarToken, verificarAdmin } = require('../middlewares/authMiddleware');

router.get('/', verificarToken, getCategorias);
router.post('/', verificarToken, verificarAdmin, createCategoria);
router.put('/:id', verificarToken, verificarAdmin, updateCategoria);
router.delete('/:id', verificarToken, verificarAdmin, deleteCategoria);

module.exports = router;