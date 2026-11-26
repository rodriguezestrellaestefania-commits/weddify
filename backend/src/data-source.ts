// apps/api/src/data-source.ts
import 'reflect-metadata';
import 'dotenv/config';
import { DataSource } from 'typeorm';
import { User } from './entities/User';

const isDev = process.env.NODE_ENV !== 'production';
// synchronize:true SOLO en desarrollo local (ver §7)
const synchronize =
  process.env.TYPEORM_SYNC === 'true' || (isDev && process.env.TYPEORM_SYNC !== 'false');

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  // En Windows + tsx conviene listar entidades por clase (más fiable que globs)
  entities: [User],
  migrations: ['src/migrations/*.{ts,js}'],
  synchronize, // true solo en dev — NUNCA en producción
  logging: isDev, // ves el SQL en consola (útil en clase)
});