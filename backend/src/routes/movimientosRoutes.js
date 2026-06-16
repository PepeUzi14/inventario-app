const express = require('express');
const router = express.Router();
const { getMovimientos, entradaStock, salidaStock } = require('../controllers/movimientosController');
const { verificarToken, verificarAdmin } = require('../middlewares/authMiddleware');

router.get('/', verificarToken, getMovimientos);
router.post('/entrada', verificarToken, verificarAdmin, entradaStock);
router.post('/salida', verificarToken, verificarAdmin, salidaStock);

module.exports = router;