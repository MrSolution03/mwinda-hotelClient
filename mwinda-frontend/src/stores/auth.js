// src/stores/auth.js

import { defineStore } from 'pinia';
import api from '@/services/api';
import router from '@/router';
// import router from '@/router'; // <-- SUPPRIMER CETTE LIGNE

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user')) || null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.user,
    isAdmin: (state) => state.user?.role === 'admin',
    token: (state) => state.user?.accessToken || null,
  },
  actions: {
    // L'action retourne maintenant la réponse pour que le composant puisse agir
    async login(email, password) {
        const response = await api.post('/auth/signin', { email, password });
        this.user = response.data;
        localStorage.setItem('user', JSON.stringify(response.data));
        return response.data; // Retourner les données
    },
    // L'action signup ne fait que l'appel API
    async signup(payload) {
        return await api.post('/auth/signup', payload);
    },

    // dans la section `actions` de src/stores/auth.js

async forgotPassword(email) {
  return await api.post('/auth/forgot-password', { email });
},
async resetPassword(token, password) {
  return await api.post(`/auth/reset-password/${token}`, { password });
},
   logout() {
      this.user = null;
      localStorage.removeItem('user');
      // Rediriger vers la page d'accueil publique
      router.push('/'); 
    },


    // dans la section `actions` de src/stores/auth.js

async fetchUserProfile() {
  const response = await api.get('/user/profile');
  // Mettre à jour seulement les champs pertinents pour éviter de surcharger this.user
  this.user.fullName = response.data.fullName;
  this.user.phoneNumber = response.data.phoneNumber;
  this.user.address = response.data.address;
  // Mettre à jour aussi le localStorage
  localStorage.setItem('user', JSON.stringify(this.user));
  return response.data;
},
async updateUserProfile(payload) {
  const response = await api.put('/user/profile', payload);
  // Re-fetch le profil pour être sûr d'avoir les données à jour
  await this.fetchUserProfile();
  return response.data;
}
  },
});
