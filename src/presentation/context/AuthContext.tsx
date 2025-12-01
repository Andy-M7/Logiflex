import React, { createContext, useState, ReactNode } from "react";
import { User } from "../../domain/entities/User";

interface AuthContextProps {
  user: User | null;
  setUser: (u: User | null) => void;
  loading: boolean;
  setLoading: (val: boolean) => void;
}

export const AuthContext = createContext<AuthContextProps>({
  user: null,
  setUser: () => {},
  loading: false,
  setLoading: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  return (
    <AuthContext.Provider value={{ user, setUser, loading, setLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
