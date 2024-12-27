import { createContext, useContext, useState } from 'react';
import { login as loginService } from '../services/authService';
import api from '../services/api'; // Assurez-vous que le chemin d'importation est correct

const AuthContext = createContext();
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

   const register = async (userData) => {
    try {
      const response = await api.post('/auth/register', {
        username: userData.email,
        password: userData.password
      });
      
      // Optionnel : vous pouvez gérer la réponse ici si nécessaire
      return response.data;
    } catch (error) {
      // Propager l'erreur pour la gérer dans le composant Register
      throw error;
    }
  };

  const login = async (credentials) => {
    try {
      const response = await api.post('/auth/login', {
        username: credentials.email,
        password: credentials.password,
      });
  
      // Vérifiez si le token est dans l'en-tête Authorization
      let token = response.headers.authorization?.split(' ')[1];
  
      // Si le token n'est pas dans les en-têtes, vérifiez le corps
      if (!token && response.data.token) {
        token = response.data.token;
      }
  
      if (!token) {
        throw new Error('Token non reçu');
      }
  
      localStorage.setItem('jwtToken', token); // Stocker le token dans localStorage
      setUser({ username: credentials.email });
    } catch (error) {
      console.error('Erreur de connexion :', error);
      throw error;
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