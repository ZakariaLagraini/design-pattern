import axios from 'axios';

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
  withCredentials: true, // Si nécessaire pour envoyer les cookies/credentials
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('jwtToken'); // Assurez-vous que le nom de la clé est correct
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Erreur Axios :', error.response || error.message);
    return Promise.reject(error);
  }
);

export default instance;
