// backend/src/auth/auth.routes.ts
import { Router } from 'express';
import bcrypt from 'bcrypt';
import { AppDataSource } from '../data-source';
import { User, type Role } from '../entities/User';
import type { AuthUser } from './types';
import { signToken } from './jwt';
import { requireAuth } from './middleware';

const router = Router();
const SALT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS ?? 12);

/**
 * POST /api/auth/register
 * Body: { email, password, name?, role? }
 * - Hashea con bcrypt
 * - Guarda User con passwordHash (TypeORM)
 * - Devuelve JWT + datos públicos
 */
router.post('/register', async (req, res) => {
  try {
    const { email, password, name, role = 'planner' } = req.body as {
      email?: string;
      password?: string;
      name?: string;
      role?: Role;
    };

    if (!email || !password) {
      return res.status(400).json({ error: 'email y password son obligatorios' });
    }
    if (password.length < 8) {
      return res.status(400).json({ error: 'password mínimo 8 caracteres' });
    }
    const allowed: Role[] = ['planner', 'novios', 'admin'];
    if (!allowed.includes(role)) {
      return res.status(400).json({ error: 'role inválido' });
    }

    const userRepo = AppDataSource.getRepository(User);

    const existing = await userRepo.findOne({
      where: { email: email.toLowerCase() },
    });
    if (existing) {
      return res.status(409).json({ error: 'El email ya está registrado' });
    }

    // HASH: nunca guardamos password en claro
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    const user = userRepo.create({
      email: email.toLowerCase(),
      passwordHash,
      role,
      name: name ?? null,
    });
    await userRepo.save(user);

    const authUser: AuthUser = {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    };
    const token = signToken(authUser);

    return res.status(201).json({
      token,
      user: {
        id: authUser.id,
        email: authUser.email,
        role: authUser.role,
        name: authUser.name,
      },
    });
  } catch (err) {
    console.error('register error', err);
    return res.status(500).json({ error: 'Error al registrar' });
  }
});

/**
 * POST /api/auth/login
 * Body: { email, password }
 * - Busca con TypeORM
 * - bcrypt.compare
 * - Si OK → JWT; si no → 401 genérico
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body as { email?: string; password?: string };

    if (!email || !password) {
      return res.status(400).json({ error: 'email y password son obligatorios' });
    }

    const userRepo = AppDataSource.getRepository(User);
    const user = await userRepo.findOne({
      where: { email: email.toLowerCase() },
    });

    // Mismo mensaje si no existe o si la clave falla (no filtrar emails)
    if (!user) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const authUser: AuthUser = {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    };
    const token = signToken(authUser);

    return res.json({
      token,
      user: {
        id: authUser.id,
        email: authUser.email,
        role: authUser.role,
        name: authUser.name,
      },
    });
  } catch (err) {
    console.error('login error', err);
    return res.status(500).json({ error: 'Error al iniciar sesión' });
  }
});

/**
 * GET /api/auth/me
 * Header: Authorization: Bearer <token>
 */
router.get('/me', requireAuth, async (req, res) => {
  // Opcional: recargar desde BD por si cambió el rol
  const userRepo = AppDataSource.getRepository(User);
  const fresh = await userRepo.findOne({ where: { id: req.user!.id } });
  if (!fresh) {
    return res.status(401).json({ error: 'No autenticado' });
  }
  return res.json({
    user: {
      id: fresh.id,
      email: fresh.email,
      role: fresh.role,
      name: fresh.name,
    },
  });
});

export default router;