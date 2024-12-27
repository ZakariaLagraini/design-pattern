import api from './api';

// Fonction pour s'enregistrer (register)
export const register = async (userData) => {
  try {
    const response = await api.post('/auth/register', userData);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de l’enregistrement:', error.response?.data || error.message);
    throw error;
  }
};

// Fonction pour se connecter (login)
export const login = async (credentials) => {
  try {
    const response = await api.post('/auth/login', credentials);

    // Store JWT token and user info if login successful
    if (response.data.token) {
      localStorage.setItem('jwtToken', response.data.token);
      
      // Create user info object from response data
      const userInfo = {
        id: response.data.userId,
        token: response.data.token
      };
        
      setUser(userInfo);
    }

    return true;
  } catch (error) {
    console.error('Login error:', error.response?.data || error.message);
    throw error;
  }
};

// Fonction pour obtenir les informations d'un utilisateur par ID
export const getUserById = async (id) => {
  try {
    const response = await api.get(`/auth/user/${id}`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération de l’utilisateur:', error.response?.data || error.message);
    throw error;
  }
};

// Fonction pour supprimer un utilisateur
export const deleteUserById = async (id) => {
  try {
    const response = await api.delete(`/auth/user/${id}`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la suppression de l’utilisateur:', error.response?.data || error.message);
    throw error;
  }
};

// Fonction pour mettre à jour un utilisateur
export const updateUser = async (id, updatedUserData) => {
  try {
    const response = await api.put(`/auth/user/${id}`, updatedUserData);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l’utilisateur:', error.response?.data || error.message);
    throw error;
  }
};
