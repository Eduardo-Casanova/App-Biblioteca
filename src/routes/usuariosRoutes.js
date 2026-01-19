const express = require('express');
const router = express.Router();
const {
  getUsuariosMorosos5a10,
  getUsuariosMorosos10Plus
} = require('../controllers/usuariosController');

// Rutas para usuarios
router.get('/morosos/5-10', getUsuariosMorosos5a10);
router.get('/morosos/10-plus', getUsuariosMorosos10Plus);

module.exports = router;