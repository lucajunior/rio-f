import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthUser } from '@/types';

interface AuthContextType {
  user: AuthUser | null;
  login: (matricula: string, senha: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Mock users for demonstration
const mockUsers: (AuthUser & { senha: string })[] = [
  {
    id: '1',
    matricula: 'admin',
    nome: 'Administrador do Sistema',
    role: 'admin',
    senha: 'admin123'
  },
  {
    id: '2',
    matricula: '123456',
    nome: 'João Silva',
    role: 'user',
    senha: '123456'
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('authUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (matricula: string, senha: string): Promise<boolean> => {
    const foundUser = mockUsers.find(u => u.matricula === matricula && u.senha === senha);
    
    if (foundUser) {
      const authUser: AuthUser = {
        id: foundUser.id,
        matricula: foundUser.matricula,
        nome: foundUser.nome,
        role: foundUser.role
      };
      
      setUser(authUser);
      localStorage.setItem('authUser', JSON.stringify(authUser));
      return true;
    }
    
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('authUser');
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};