const pool = require('../config/database');


// Obtener libros más prestados
const getLibrosMasPrestados = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        l.id_libro AS id,
        l.titulo,
        CONCAT(a.nombre, ' ', a.apellido) AS autor,
        COUNT(p.id_prestamo) AS prestamos
      FROM libros l
      LEFT JOIN prestamos p ON l.id_libro = p.id_libro
      JOIN autores a ON l.id_autor = a.id_autor
      GROUP BY l.id_libro, l.titulo, autor
      ORDER BY prestamos DESC
      LIMIT 5
    `);
    res.json(rows);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error al obtener libros más prestados' });
  }
};

// Obtener libros menos prestados
const getLibrosMenosPrestados = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        l.id_libro AS id,
        l.titulo,
        CONCAT(a.nombre, ' ', a.apellido) AS autor,
        COUNT(p.id_prestamo) AS prestamos
      FROM libros l
      LEFT JOIN prestamos p ON l.id_libro = p.id_libro
      JOIN autores a ON l.id_autor = a.id_autor
      GROUP BY l.id_libro, l.titulo, autor
      ORDER BY prestamos ASC
      LIMIT 3
    `);
    res.json(rows);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error al obtener libros menos prestados' });
  }
};

// Obtener estadísticas del semestre
const getEstadisticasSemestre = async (req, res) => {
  try {
    const [libroMasPrestado] = await pool.query(`
      SELECT 
        l.titulo,
        COUNT(p.id_prestamo) AS prestamos
      FROM prestamos p
      JOIN libros l ON p.id_libro = l.id_libro
      WHERE p.fecha_prestamo >= DATE_SUB(CURRENT_DATE, INTERVAL 6 MONTH)
      GROUP BY l.id_libro, l.titulo
      ORDER BY prestamos DESC
      LIMIT 1
    `);

    const [usuarioMasActivo] = await pool.query(`
      SELECT 
        CONCAT(u.nombre, ' ', u.apellido) AS nombre,
        COUNT(p.id_prestamo) AS prestamos
      FROM prestamos p
      JOIN usuarios u ON p.id_usuario = u.id_usuario
      WHERE p.fecha_prestamo >= DATE_SUB(CURRENT_DATE, INTERVAL 6 MONTH)
      GROUP BY u.id_usuario, nombre
      ORDER BY prestamos DESC
      LIMIT 1
    `);

    res.json({
      libroMasPrestado: libroMasPrestado[0] || null,
      usuarioMasActivo: usuarioMasActivo[0] || null
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error al obtener estadísticas del semestre' });
  }
};

// Obtener géneros más solicitados
const getGenerosMasSolicitados = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        g.nombre AS genero,
        COUNT(p.id_prestamo) AS cantidad
      FROM prestamos p
      JOIN libros l ON p.id_libro = l.id_libro
      JOIN generos g ON l.id_genero = g.id_genero
      GROUP BY g.id_genero, g.nombre
      ORDER BY cantidad DESC
      LIMIT 5
    `);
    res.json(rows);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error al obtener géneros más solicitados' });
  }
};

// Obtener 4 libros aleatorios
const getLibrosAleatorios = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        l.id_libro AS id,
        l.titulo,
        CONCAT(a.nombre, ' ', a.apellido) AS autor,
        g.nombre AS genero
      FROM libros l
      JOIN autores a ON l.id_autor = a.id_autor
      JOIN generos g ON l.id_genero = g.id_genero
      ORDER BY RAND()
      LIMIT 4
    `);
    res.json(rows);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error al obtener libros aleatorios' });
  }
};

module.exports = {
  getLibrosMasPrestados,
  getLibrosMenosPrestados,
  getEstadisticasSemestre,
  getGenerosMasSolicitados,
  getLibrosAleatorios
};