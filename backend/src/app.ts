// backend/src/app.ts
import express from 'express';
import passport from 'passport';
import './auth/jwt'; // registra la JwtStrategy al cargar el módulo
import authRouter from './auth/auth.routes';
import { AppDataSource } from './data-source';
import cors from "cors";

const app = express();

app.use(express.json());
app.use(passport.initialize()); // sin passport.session() — solo JWT

app.use(cors({ origin: "http://localhost:5173" }));

/**
 * Health básico + opcional SELECT 1 para comprobar Postgres
 * GET /api/health
 */
app.get('/api/health', async (_req, res) => {
  const payload: {
    ok: boolean;
    service: string;
    db?: 'up' | 'down';
  } = {
    ok: true,
    service: 'weddify-api',
  };

  // Opcional: si TypeORM ya está inicializado, prueba la conexión
  if (AppDataSource.isInitialized) {
    try {
      await AppDataSource.query('SELECT 1');
      payload.db = 'up';
    } catch {
      payload.ok = false;
      payload.db = 'down';
      return res.status(503).json(payload);
    }
  }

  return res.json(payload);
});

app.use('/api/auth', authRouter);

export default app;