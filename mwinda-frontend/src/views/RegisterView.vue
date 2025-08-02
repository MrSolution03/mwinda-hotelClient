<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useToast } from 'primevue/usetoast';
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import Button from 'primevue/button';
import Card from 'primevue/card';

const router = useRouter();
const authStore = useAuthStore();
const toast = useToast();

const formData = ref({
  fullName: '',
  email: '',
  phoneNumber: '',
  address: '',
  password: '',
});
const loading = ref(false);

const handleRegister = async () => {
  // Validation simple
  if (!formData.value.fullName || !formData.value.email || !formData.value.password) {
    toast.add({ severity: 'warn', summary: 'Champs requis', detail: 'Veuillez remplir le nom, l\'email et le mot de passe.', life: 3000 });
    return;
  }
  loading.value = true;
  try {
    await authStore.signup(formData.value);
    toast.add({ severity: 'success', summary: 'Succès', detail: 'Inscription réussie ! Vous pouvez maintenant vous connecter.', life: 5000 });
    router.push('/connexion'); // Gérer la redirection ici
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Erreur', detail: error.response?.data?.message || 'Une erreur est survenue lors de l\'inscription.', life: 3000 });
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="auth-page">
    <Card class="auth-card">
      <template #title><h2 class="text-center">Créer un Compte</h2></template>
      <template #content>
        <form @submit.prevent="handleRegister" class="p-fluid">
          <div class="p-field">
            <label for="fullName">Nom complet</label>
            <InputText id="fullName" v-model="formData.fullName" />
          </div>
          <div class="p-field">
            <label for="email">Email</label>
            <InputText id="email" v-model="formData.email" type="email" />
          </div>
          <div class="p-field">
            <label for="phone">Numéro de téléphone</label>
            <InputText id="phone" v-model="formData.phoneNumber" />
          </div>
          <div class="p-field">
            <label for="address">Adresse</label>
            <InputText id="address" v-model="formData.address" />
          </div>
          <div class="p-field">
            <label for="password">Mot de passe</label>
            <Password id="password" v-model="formData.password" toggleMask :feedback="false" />
          </div>
          <Button type="submit" label="S'inscrire" :loading="loading" class="p-mt-2" />
        </form>
      </template>
      <template #footer>
        <div class="text-center">
          Déjà un compte ? <RouterLink to="/connexion">Connectez-vous</RouterLink>
        </div>
      </template>
    </Card>
  </div>
</template>

<style scoped>
.auth-page { display: flex; justify-content: center; align-items: center; padding: 2rem; }
.auth-card { width: 100%; max-width: 500px; }
.p-field { margin-bottom: 1.2rem; }
.text-center { text-align: center; }
</style>