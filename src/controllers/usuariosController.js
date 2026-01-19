const pool = require('../config/database');


// Obtener usuarios morosos de 5-10 semanas
const getUsuariosMorosos5a10 = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        u.id_usuario,
        CONCAT(u.nombre, ' ', u.apellido) AS nombre_completo,
        l.titulo AS libro,
        TIMESTAMPDIFF(WEEK, p.fecha_devolucion_esperada, CURRENT_DATE) AS semanas_retraso,
        (TIMESTAMPDIFF(WEEK, p.fecha_devolucion_esperada, CURRENT_DATE) * 20) AS multa
      FROM prestamos p
      JOIN usuarios u ON p.id_usuario = u.id_usuario
      JOIN libros l ON p.id_libro = l.id_libro
      WHERE p.fecha_devolucion_real IS NULL
        AND TIMESTAMPDIFF(WEEK, p.fecha_devolucion_esperada, CURRENT_DATE) BETWEEN 5 AND 10
      ORDER BY semanas_retraso DESC
    `);
    res.json(rows);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error al obtener usuarios morosos 5-10 semanas' });
  }
};

// Obtener usuarios morosos de más de 10 semanas
const getUsuariosMorosos10Plus = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        u.id_usuario,
        CONCAT(u.nombre, ' ', u.apellido) AS nombre_completo,
        l.titulo AS libro,
        TIMESTAMPDIFF(WEEK, p.fecha_devolucion_esperada, CURRENT_DATE) AS semanas_retraso,
        (TIMESTAMPDIFF(WEEK, p.fecha_devolucion_esperada, CURRENT_DATE) * 20) AS multa
      FROM prestamos p
      JOIN usuarios u ON p.id_usuario = u.id_usuario
      JOIN libros l ON p.id_libro = l.id_libro
      WHERE p.fecha_devolucion_real IS NULL
        AND TIMESTAMPDIFF(WEEK, p.fecha_devolucion_esperada, CURRENT_DATE) > 10
      ORDER BY semanas_retraso DESC
    `);
    res.json(rows);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error al obtener usuarios morosos +10 semanas' });
  }
};

module.exports = {
  getUsuariosMorosos5a10,
  getUsuariosMorosos10Plus
};