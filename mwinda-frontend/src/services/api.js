// src/services/api.js

import axios from 'axios';

// On n'importe PAS le store ici. C'est une meilleure pratique.

const api = axios.create({
  // PROBLÈME 1 CORRIGÉ : Utiliser le bon port pour le backend
  baseURL: 'https://hotel-mwinda.onrender.com/api', 
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur de requête
api.interceptors.request.use(
  (config) => {
    // PROBLÈME 2 CORRIGÉ : On n'utilise plus useAuthstr() ou useAuthStore() ici.
    // On lit directement et de manière sûre depuis le localStorage.
    const user = JSON.parse(localStorage.getItem('user'));
    
    // Si un utilisateur est connecté et a un token, on l'ajoute à l'en-tête.
    if (user && user.accessToken) {
      config.headers['x-access-token'] = user.accessToken;
    }

    // On retourne la configuration pour que la requête puisse partir.
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// L'intercepteur de réponse peut rester si vous souhaitez gérer des erreurs globales
api.interceptors.response.use(
  response => response,
  error => {
    // Note : La déconnexion automatique ici peut parfois être agressive.
    // C'est une option, mais il est souvent mieux de gérer l'erreur dans le composant.
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      console.error("Accès non autorisé ou token invalide. L'utilisateur sera déconnecté au prochain rechargement.");
      // Pour une déconnexion immédiate, il faudrait des imports plus complexes.
      // Le plus simple est de supprimer l'utilisateur du localStorage.
      localStorage.removeItem('user');
    }
    return Promise.reject(error);
  }
);


export default api;
