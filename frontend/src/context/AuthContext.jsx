import { createContext, useContext, useState } from 'react';
import { login as loginService } from '../services/authService';

const AuthContext = createContext();
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const register = async (userData) => {
    try {
      // Votre logique d'inscription ici (API call, etc.)
      // Ne pas définir l'utilisateur après l'inscription
      setUser(null);
      return true;
    } catch (error) {
      throw error;
    }
  };

  const login = async (credentials) => {
    try {
      const response = await api.post('/login', credentials);
      const token = response.headers.authorization.split(' ')[1];
      localStorage.setItem('jwtToken', token);
      // ...
    } catch (error) {
      console.error('Erreur de connexion :', error.message);
    }
  };
  

  const logout = () => {
    setUser(null);
    localStorage.removeItem('jwtToken');
  };

  return (
    <AuthContext.Provider value={{ user, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);