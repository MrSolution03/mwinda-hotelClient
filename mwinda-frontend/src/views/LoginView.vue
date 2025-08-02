<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router'; // Import manquant
import { useAuthStore } from '@/stores/auth';
import { useToast } from 'primevue/usetoast';
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import Button from 'primevue/button';
import Card from 'primevue/card';

const router = useRouter(); // Initialisation manquante
const authStore = useAuthStore();
const toast = useToast();

const email = ref('');
const password = ref('');
const loading = ref(false);

const handleLogin = async () => {
  loading.value = true;
  try {
    const user = await authStore.login(email.value, password.value);
    toast.add({ severity: 'success', summary: 'Succès', detail: 'Connexion réussie !', life: 3000 });
    // Redirection gérée dans le composant
    router.push(user.role === 'admin' ? '/admin' : '/profil');
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Erreur', detail: error.response?.data?.message || 'Email ou mot de passe incorrect.', life: 3000 });
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="auth-page">
    <Card class="auth-card">
      <template #title>
        <h2 class="text-center">Connexion</h2>
      </template>
      <template #content>
        <form @submit.prevent="handleLogin">
          <div class="p-fluid">
            <div class="p-field">
              <label for="email">Email</label>
              <InputText id="email" v-model="email" type="email" />
            </div>
            <div class="p-field">
              <label for="password">Mot de passe</label>
              <Password id="password" v-model="password" :feedback="false" toggleMask />
            </div>
            <Button type="submit" label="Se connecter" :loading="loading" class="p-mt-2" />
          </div>
        </form>
      </template>
      <template #footer>
        <div class="login-links">
            <RouterLink to="/mot-de-passe-oublie">Mot de passe oublié ?</RouterLink>
            <span> | </span>
            <RouterLink to="/inscription">Créer un compte</RouterLink>
        </div>
      </template>
    </Card>
  </div>
</template>

<style scoped>
/* TOUT LE STYLE EST REGROUPÉ ICI */
.auth-page { 
  display: flex; 
  justify-content: center; 
  align-items: center; 
  padding: 2rem; 
}
.auth-card { 
  width: 100%; 
  max-width: 450px; 
}
.p-field { 
  margin-bottom: 1.5rem; 
}
.text-center { 
  text-align: center; 
}
.login-links { 
  text-align: center; 
  margin-top: 1rem; 
}
</style>