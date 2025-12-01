import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { AuthRepositoryImpl } from "../../data/repositories/AuthRepositoryImpl";
import { LoginUseCase } from "../../useCases/auth/LoginUseCase";

export const useAuth = () => {
  const { user, setUser, loading, setLoading } = useContext(AuthContext);

  const repository = new AuthRepositoryImpl();
  const loginUseCase = new LoginUseCase(repository);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const loggedUser = await loginUseCase.execute(email, password);
      setUser(loggedUser);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await repository.logout();
    setUser(null);
  };

  return {
    user,
    loading,
    login,
    logout,
  };
};
