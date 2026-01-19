const express = require('express');
const router = express.Router();
const {
  getAutoresPorPais,
  getPublicacionesPorPais
} = require('../controllers/autoresController');

// Rutas para autores
router.get('/por-pais', getAutoresPorPais);
router.get('/publicaciones/por-pais', getPublicacionesPorPais);

module.exports = router;