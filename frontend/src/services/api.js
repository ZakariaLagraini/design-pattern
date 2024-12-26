import axios from 'axios';

// Création d'une instance Axios
const api = axios.create({
  baseURL: 'http://localhost:8080', // L'URL de votre backend (port 8080)
  timeout: 5000, // Temps limite pour les requêtes
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
    'Access-Control-Allow-Headers': '*'

  },
});

// Ajouter un intercepteur pour inclure le token JWT dans chaque requête
api.interceptors.request.use(
  (config) => {
    // Récupérer le token JWT depuis le localStorage
    const token = localStorage.getItem('jwtToken');

    // Si un token existe, l'ajouter au header Authorization
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
