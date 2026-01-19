const express = require('express');
const router = express.Router();
const {
  getLibrosMasPrestados,
  getLibrosMenosPrestados,
  getEstadisticasSemestre,
  getGenerosMasSolicitados,
  getLibrosAleatorios
} = require('../controllers/librosController');

// Rutas para libros
router.get('/mas-prestados', getLibrosMasPrestados);
router.get('/menos-prestados', getLibrosMenosPrestados);
router.get('/aleatorios', getLibrosAleatorios);

// Rutas para estadísticas
router.get('/estadisticas/semestre', getEstadisticasSemestre);
router.get('/generos/mas-solicitados', getGenerosMasSolicitados);

module.exports = router;