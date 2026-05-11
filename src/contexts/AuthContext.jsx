// contexts/AuthContext.jsx
// Context para gerenciar autenticação globalmente na aplicação

import { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Carregar usuário do localStorage ao iniciar
  useEffect(() => {
    const loadUser = () => {
      try {
        const userData = auth.getUser();
        setUser(userData);
      } catch (error) {
        console.error('Erro ao carregar usuário:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // Função de login
  const login = (userData) => {
    auth.saveUser(userData);
    setUser(userData);
  };

  // Função de logout
  const logout = () => {
    auth.logout();
    setUser(null);
  };

  // Verificar se está autenticado
  const isAuthenticated = () => {
    return user !== null;
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
