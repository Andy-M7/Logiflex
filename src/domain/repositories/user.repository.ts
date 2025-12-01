import { User } from '../entities/user';

export interface UserRepository {
  login(email: string, password: string): Promise<User>;
  // Métodos nuevos para la gestión de usuarios
  getAll(): Promise<User[]>;
  create(user: { email: string; fullName: string; password?: string }): Promise<User>;
  remove(id: string): Promise<void>;
  update(id: string, user: Partial<User>): Promise<User>;
}