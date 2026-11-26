// backend/src/auth/middleware.ts
import type { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import type { AuthUser, Role } from './types';

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  passport.authenticate('jwt', { session: false }, (err: unknown, user: AuthUser | false) => {
    if (err || !user) {
      return res.status(401).json({ error: 'No autenticado' });
    }
    req.user = user;
    return next();
  })(req, res, next);
}

export function requireRole(...roles: Role[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as AuthUser | undefined;
    if (!user || !roles.includes(user.role)) {
      return res.status(403).json({ error: 'Sin permiso para este recurso' });
    }
    return next();
  };
}