export type Role = 'planner' | 'novios' | 'admin';

export interface AuthUser {
  id: string;
  email: string;
  role: Role;
  name?: string | null;
}