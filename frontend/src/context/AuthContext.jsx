import { createContext, useState, useContext } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = async (credentials) => {
    // Simulate login - just for demo
    if (credentials.email && credentials.password) {
      setUser({ email: credentials.email });
      localStorage.setItem('demo_user', credentials.email);
    } else {
      throw new Error('Invalid credentials');
    }
  };

  const register = async (userData) => {
    // Simulate registration - just for demo
    if (userData.email && userData.password) {
      setUser({ email: userData.email });
      localStorage.setItem('demo_user', userData.email);
    } else {
      throw new Error('Invalid user data');
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('demo_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext); 