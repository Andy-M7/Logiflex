import { User } from "../../domain/entities/user";
import { UserRepository } from "../../domain/repositories/user.repository";
import { backendApi } from "../source/remote/api/backendApi";
import { LoginResponse } from "../source/remote/interface/backendApi";

export class UserRepositoryImpl implements UserRepository {
  
  // --- LOGIN (Existente) ---
  async login(email: string, password: string): Promise<User> {
    try {
      const { data } = await backendApi.post<LoginResponse>('/auth/login', {
        email,
        password
      });
      // Retornamos combinando datos del usuario y el token
      return { ...data.user, token: data.token || (data as any).access_token }; 
    } catch (error) {
      console.log('Error en login:', error);
      throw error;
    }
  }

  // --- NUEVO: LISTAR TODOS ---
  async getAll(): Promise<User[]> {
    const { data } = await backendApi.get<User[]>('/auth');
    return data;
  }

  // --- NUEVO: CREAR USUARIO ---
  async create(user: { email: string; fullName: string; password?: string }): Promise<User> {
    // Usamos el endpoint de registro que ya tenías
    const { data } = await backendApi.post('/auth/register', user);
    return data.user || data;
  }

  // --- NUEVO: ELIMINAR USUARIO ---
  async remove(id: string): Promise<void> {
    await backendApi.delete(`/auth/${id}`);
  }
    async update(id: string, user: Partial<User>): Promise<User> {
    // backendApi ya tiene la baseURL configurada, así que esto llama a PATCH /auth/:id
    const { data } = await backendApi.patch<User>(`/auth/${id}`, user);
    return data;
  }
}