import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserRepositoryImpl } from '../../data/repositories/UserRepositoryImpl';
import { User } from '../entities/user';

// Instanciamos el repositorio
const userRepository = new UserRepositoryImpl();

export const LoginUseCase = async (email: string, password: string): Promise<User> => {
  // 1. Llamamos al método login del repositorio
  const user = await userRepository.login(email, password);

  // 2. Extraemos y guardamos el token si existe
  // Nota: Usamos (user as any) porque tu interfaz 'User' original no tiene la propiedad 'token' explícita,
  // pero el backend probablemente la está enviando junto con los datos del usuario.
  const token = (user as any).token || (user as any).accessToken;

  if (token) {
    await AsyncStorage.setItem('auth:token', token);
  }

  // 3. Guardamos la información del usuario en local
  await AsyncStorage.setItem('auth:user', JSON.stringify(user));

  return user;
};