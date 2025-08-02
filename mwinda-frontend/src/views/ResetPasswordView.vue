<script setup>
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useToast } from 'primevue/usetoast';
import Password from 'primevue/password';
import Button from 'primevue/button';
import Card from 'primevue/card';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const toast = useToast();

const password = ref('');
const loading = ref(false);
const token = route.params.token;

const handleResetPassword = async () => {
    loading.value = true;
    try {
        await authStore.resetPassword(token, password.value);
        toast.add({ severity: 'success', summary: 'Succès', detail: 'Votre mot de passe a été réinitialisé. Vous pouvez vous connecter.', life: 5000 });
        router.push('/connexion');
    } catch(error) {
        toast.add({ severity: 'error', summary: 'Erreur', detail: error.response?.data?.message || 'Le lien est invalide ou a expiré.', life: 4000 });
    } finally {
        loading.value = false;
    }
}
</script>

<template>
     <div class="auth-page">
        <Card class="auth-card">
            <template #title><h2 class="text-center">Réinitialiser le Mot de Passe</h2></template>
            <template #content>
                 <form @submit.prevent="handleResetPassword" class="p-fluid">
                    <div class="p-field">
                        <label for="password">Nouveau mot de passe</label>
                        <Password id="password" v-model="password" toggleMask />
                    </div>
                    <Button type="submit" label="Mettre à jour" :loading="loading" />
                </form>
            </template>
        </Card>
    </div>
</template>

<style scoped>
.auth-page { display: flex; justify-content: center; align-items: center; padding: 2rem; }
.auth-card { width: 100%; max-width: 450px; }
.p-field { margin-bottom: 1.5rem; }
</style>