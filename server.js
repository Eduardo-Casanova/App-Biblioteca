require('dotenv').config();
const app = require('./src/app');

const PORT = process.env.PORT || 3001;

const startServer = async () => {
    try {
      app.listen(PORT, () => {
        console.log('\n🚀 ========================================');
        console.log(`   Servidor API corriendo en http://localhost:${PORT}/api/health`);
        console.log('   ========================================');
  
        console.log('\n📚 Endpoints disponibles:\n');
  
        console.log('🩺 Estado');
        console.log('   GET  /api/health\n');
  
        console.log('📊 Datos consolidados');
        console.log('   GET  /api/datos-completos\n');
  
        console.log('📋 Usuarios');
        console.log('   GET  /api/usuarios/morosos/5-10');
        console.log('   GET  /api/usuarios/morosos/10-plus\n');
  
        console.log('📖 Libros');
        console.log('   GET  /api/libros/mas-prestados');
        console.log('   GET  /api/libros/menos-prestados');
        console.log('   GET  /api/libros/aleatorios');
        console.log('   GET  /api/libros/estadisticas/semestre');
        console.log('   GET  /api/libros/generos/mas-solicitados\n');
  
        console.log('✍️ Autores');
        console.log('   GET  /api/autores/por-pais');
        console.log('   GET  /api/autores/publicaciones/por-pais\n');
  
        console.log('✅ API lista para recibir peticiones');
        console.log('========================================\n');
      });
    } catch (error) {
      console.error('❌ Error al iniciar el servidor:', error);
      process.exit(1);
    }
  };
  

startServer();
