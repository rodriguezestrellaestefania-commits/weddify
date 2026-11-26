import 'reflect-metadata';
import 'dotenv/config';
import { AppDataSource } from './data-source';
import app from './app'; // ← archivo app.ts, NO una carpeta

const PORT = Number(process.env.PORT ?? 3000);

async function main() {
  await AppDataSource.initialize();
  console.log('TypeORM conectado. synchronize =', AppDataSource.options.synchronize);

  app.listen(PORT, () => {
    console.log(`API Weddify en http://localhost:${PORT}`);
  });
}

main().catch((err) => {
  console.error('No se pudo arrancar la API', err);
  process.exit(1);
});