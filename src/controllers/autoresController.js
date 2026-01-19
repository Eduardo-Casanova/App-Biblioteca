const pool = require('../config/database');

// Obtener países con más autores
const getAutoresPorPais = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        p.nombre AS pais,
        COUNT(a.id_autor) AS autores
      FROM autores a
      JOIN paises p ON a.id_pais = p.id_pais
      GROUP BY p.id_pais, p.nombre
      ORDER BY autores DESC
      LIMIT 5
    `);
    res.json(rows);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error al obtener autores por país' });
  }
};

// Obtener países con más y menos publicaciones
const getPublicacionesPorPais = async (req, res) => {
  try {
    const [masPublicaciones] = await pool.query(`
      SELECT 
        p.nombre AS pais,
        COUNT(l.id_libro) AS publicaciones
      FROM libros l
      JOIN paises p ON l.id_pais_publicacion = p.id_pais
      GROUP BY p.id_pais, p.nombre
      ORDER BY publicaciones DESC
      LIMIT 1
    `);

    const [menosPublicaciones] = await pool.query(`
      SELECT 
        p.nombre AS pais,
        COUNT(l.id_libro) AS publicaciones
      FROM libros l
      JOIN paises p ON l.id_pais_publicacion = p.id_pais
      GROUP BY p.id_pais, p.nombre
      ORDER BY publicaciones ASC
      LIMIT 1
    `);

    res.json({
      masPublicaciones: masPublicaciones[0] || null,
      menosPublicaciones: menosPublicaciones[0] || null
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error al obtener publicaciones por país' });
  }
};

module.exports = {
  getAutoresPorPais,
  getPublicacionesPorPais
};