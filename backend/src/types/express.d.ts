import type { Role } from '../auth/types';

declare global {
  namespace Express {
    interface User {
      id: string;
      email: string;
      role: Role;
      name?: string | null;
    }
  }
}

export {};