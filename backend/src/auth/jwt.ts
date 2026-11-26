// backend/src/auth/jwt.ts
import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import jwt from 'jsonwebtoken';
import type { AuthUser, Role } from './types';

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('Falta JWT_SECRET en backend/.env');
}

const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN ?? '8h';

/** Firma un access token con claims mínimos: sub, email, role */
export function signToken(user: AuthUser): string {
  return jwt.sign(
    { email: user.email, role: user.role },
    JWT_SECRET,
    { subject: user.id, expiresIn: JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'] }
  );
}

/**
 * Strategy 'jwt':
 * - Lee Authorization: Bearer <token>
 * - Verifica firma y caducidad con JWT_SECRET
 * - Pasa el usuario a Passport → requireAuth lo pone en req.user
 */
passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: JWT_SECRET,
    },
    (payload, done) => {
      try {
        const user: AuthUser = {
          id: String(payload.sub),
          email: String(payload.email),
          role: payload.role as Role,
        };
        return done(null, user);
      } catch (err) {
        return done(err as Error, false);
      }
    }
  )
);

export { passport };