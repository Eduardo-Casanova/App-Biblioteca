const express = require('express');
const cors = require('cors');
const pool = require('./config/database');

const usuariosRoutes = require('./routes/usuariosRoutes');
const librosRoutes = require('./routes/librosRoutes');
const autoresRoutes = require('./routes/autoresRoutes');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas base
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/libros', librosRoutes);
app.use('/api/autores', autoresRoutes);

// Ruta de salud
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'API funcionando correctamente' });
});

// ✅ RUTA CONSOLIDADA (VERSIÓN SEGURA, SIN SATURAR CONEXIONES)
app.get('/api/datos-completos', async (req, res) => {
  try {
    // Usuarios morosos
    const morosos5a10 = await pool.query(`
      SELECT 
        u.id_usuario AS id,
        CONCAT(u.nombre, ' ', u.apellido) AS nombre,
        l.titulo AS libro,
        TIMESTAMPDIFF(WEEK, p.fecha_devolucion_esperada, CURRENT_DATE) AS semanas,
        (TIMESTAMPDIFF(WEEK, p.fecha_devolucion_esperada, CURRENT_DATE) * 20) AS multa
      FROM prestamos p
      JOIN usuarios u ON p.id_usuario = u.id_usuario
      JOIN libros l ON p.id_libro = l.id_libro
      WHERE p.fecha_devolucion_real IS NULL
        AND TIMESTAMPDIFF(WEEK, p.fecha_devolucion_esperada, CURRENT_DATE) BETWEEN 5 AND 10
      ORDER BY semanas DESC
    `);

    const morosos10plus = await pool.query(`
      SELECT 
        u.id_usuario AS id,
        CONCAT(u.nombre, ' ', u.apellido) AS nombre,
        l.titulo AS libro,
        TIMESTAMPDIFF(WEEK, p.fecha_devolucion_esperada, CURRENT_DATE) AS semanas,
        (TIMESTAMPDIFF(WEEK, p.fecha_devolucion_esperada, CURRENT_DATE) * 20) AS multa
      FROM prestamos p
      JOIN usuarios u ON p.id_usuario = u.id_usuario
      JOIN libros l ON p.id_libro = l.id_libro
      WHERE p.fecha_devolucion_real IS NULL
        AND TIMESTAMPDIFF(WEEK, p.fecha_devolucion_esperada, CURRENT_DATE) > 10
      ORDER BY semanas DESC
    `);

    // Libros
    const masPrestados = await pool.query(`
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

    const menosPrestados = await pool.query(`
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

    // Estadísticas del semestre
    const libroSemestre = await pool.query(`
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

    const usuarioSemestre = await pool.query(`
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

    // Géneros más solicitados
    const generos = await pool.query(`
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

    // Libros aleatorios
    const aleatorios = await pool.query(`
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

    // Autores por país
    const autoresPais = await pool.query(`
      SELECT 
        p.nombre AS pais,
        COUNT(a.id_autor) AS autores
      FROM autores a
      JOIN paises p ON a.id_pais = p.id_pais
      GROUP BY p.id_pais, p.nombre
      ORDER BY autores DESC
      LIMIT 5
    `);

    // Publicaciones por país
    const masPublicaciones = await pool.query(`
      SELECT 
        p.nombre AS pais,
        COUNT(l.id_libro) AS publicaciones
      FROM libros l
      JOIN paises p ON l.id_pais_publicacion = p.id_pais
      GROUP BY p.id_pais, p.nombre
      ORDER BY publicaciones DESC
      LIMIT 1
    `);

    const menosPublicaciones = await pool.query(`
      SELECT 
        p.nombre AS pais,
        COUNT(l.id_libro) AS publicaciones
      FROM libros l
      JOIN paises p ON l.id_pais_publicacion = p.id_pais
      GROUP BY p.id_pais, p.nombre
      ORDER BY publicaciones ASC
      LIMIT 1
    `);

    // Respuesta final
    res.json({
      usuariosMorosos: {
        semanas5a10: morosos5a10[0],
        semanas10plus: morosos10plus[0]
      },
      librosMasPrestados: masPrestados[0],
      librosMenosPrestados: menosPrestados[0],
      semestre: {
        libroMasPrestado: libroSemestre[0][0] || null,
        usuarioMasActivo: usuarioSemestre[0][0] || null
      },
      generos: generos[0],
      librosAleatorios: aleatorios[0],
      autoresPorPais: autoresPais[0],
      publicacionesPorPais: {
        masPublicaciones: masPublicaciones[0][0] || null,
        menosPublicaciones: menosPublicaciones[0][0] || null
      }
    });

  } catch (error) {
    console.error('❌ Error en /api/datos-completos:', error);
    res.status(500).json({ error: 'Error al obtener datos completos' });
  }
});

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Error interno del servidor' });
});

module.exports = app;
