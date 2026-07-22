// src/api/axiosClient.js
import axios from 'axios';
import { enqueueSnackbar } from 'notistack';

const axiosClient = axios.create({
  baseURL: 'http://localhost:8081/api',
  headers: {
    'Content-Type': 'application/json',
  },
  // Indispensable pour que les cookies httpOnly (access_token / refresh_token) soient
  // envoyés avec chaque requête et acceptés depuis les réponses du backend.
  withCredentials: true,
});

// Callback fourni par AuthContext, appelé quand la session ne peut vraiment plus être
// prolongée (refresh token expiré/invalide) -> l'app doit rediriger vers /login.
let onEchecAuthentification = () => {};
export const definirGestionnaireEchecAuth = (callback) => {
  onEchecAuthentification = callback;
};

// Évite de déclencher plusieurs /auth/refresh en parallèle si plusieurs requêtes
// échouent en même temps (ex: plusieurs appels API lancés au même moment).
let rafraichissementEnCours = null;

const estRequeteAuth = (url = '') => url.includes('/auth/login')
  || url.includes('/auth/register')
  || url.includes('/auth/refresh')
  || url.includes('/auth/logout');

axiosClient.interceptors.response.use(
  (reponse) => reponse,
  async (erreur) => {
    const requeteOriginale = erreur.config;

    const estUnAccessTokenExpire = erreur.response?.status === 401
      && requeteOriginale
      && !requeteOriginale._dejaRetente
      && !estRequeteAuth(requeteOriginale.url);

    if (estUnAccessTokenExpire) {
      requeteOriginale._dejaRetente = true;
      try {
        if (!rafraichissementEnCours) {
          rafraichissementEnCours = axiosClient.post('/auth/refresh').finally(() => {
            rafraichissementEnCours = null;
          });
        }
        await rafraichissementEnCours;
        return axiosClient(requeteOriginale);
      } catch {
        onEchecAuthentification();
        return Promise.reject(erreur);
      }
    }

    // Pas d'erreur bruyante pour un 401 sur les routes d'auth elles-mêmes
    // (ex: mauvais mot de passe à la connexion -> géré par le formulaire, pas par un snackbar générique)
    if (erreur.response?.status === 401 && estRequeteAuth(requeteOriginale?.url)) {
      return Promise.reject(erreur);
    }

    const message = erreur.response?.data?.message
      || Object.values(erreur.response?.data || {})[0]
      || 'Une erreur est survenue';
    enqueueSnackbar(message, { variant: 'error' });
    return Promise.reject(erreur);
  }
);

export default axiosClient;