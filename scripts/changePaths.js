// scripts/changePaths.js
const fs = require('fs-extra');
const { execSync } = require('child_process');
const { resolve } = require('path');

async function main() {
  try {
    // Ejecutar get-front-build definido en package.json del backend
    const backendRoot = resolve(__dirname, '..');
    if (fs.existsSync('public-new')) {
      await fs.remove('public-new');
    }
    execSync('npm run get-front-build', { stdio: 'inherit', cwd: backendRoot });
    // Swap folders
    if (fs.existsSync('public-old')) {
      await fs.remove('public-old');
    }
    // Eliminar carpeta pública existente antes de mover la nueva
    if (fs.existsSync('public')) {
      await fs.remove('public');
    }
    // Copiar nueva build a la carpeta pública
    await fs.copy('public-new', 'public', { overwrite: true });
    // Eliminar carpeta temporal public-new (ignorar errores si está en uso)
    try {
      await fs.remove('public-new');
    } catch (err) {
      console.warn('Advertencia: no se pudo eliminar public-new con fs.remove:', err.message);
      // Fallback: usar comando Windows para forzar borrado
      try {
        execSync('rd /s /q "public-new"', { stdio: 'inherit', cwd: backendRoot });
      } catch (e) {
        console.warn('Advertencia: no se pudo eliminar public-new con rd:', e.message);
      }
    }
    console.log('~~~✅ El frontend se clono y se asingó con éxito');
  } catch (err) {
    console.error('~~~⛔ Error al clonar o renombrar carpetas:', err.message);
    process.exit(1);
  }
}

main();
