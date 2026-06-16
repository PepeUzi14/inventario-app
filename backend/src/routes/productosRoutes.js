const express = require('express');
const router = express.Router();
const { getProductos, getProductoById, createProducto, updateProducto, deleteProducto, searchProductos } = require('../controllers/productosController');
const { verificarToken, verificarAdmin } = require('../middlewares/authMiddleware');

router.get('/', verificarToken, getProductos);
router.get('/search', verificarToken, searchProductos);
router.get('/:id', verificarToken, getProductoById);
router.post('/', verificarToken, verificarAdmin, createProducto);
router.put('/:id', verificarToken, verificarAdmin, updateProducto);
router.delete('/:id', verificarToken, verificarAdmin, deleteProducto);

module.exports = router;