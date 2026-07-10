// src/api/axiosClient.js
import axios from 'axios';
import { enqueueSnackbar } from 'notistack';

const axiosClient = axios.create({
  baseURL: 'http://localhost:8081/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosClient.interceptors.response.use(
  (reponse) => reponse,
  (erreur) => {
    const message = erreur.response?.data?.message
      || Object.values(erreur.response?.data || {})[0]
      || 'Une erreur est survenue';
    enqueueSnackbar(message, { variant: 'error' });
    return Promise.reject(erreur);
  }
);

export default axiosClient;