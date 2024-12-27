import axios from 'axios';

// Création d'une instance Axios
const api = axios.create({
  baseURL: 'http://localhost:8080',
  timeout: 5000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});


// Ajouter un intercepteur pour inclure le token JWT dans chaque requête
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwtToken');
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
