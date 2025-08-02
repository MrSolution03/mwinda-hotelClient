<script setup>
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useToast } from 'primevue/usetoast';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import Card from 'primevue/card';

const authStore = useAuthStore();
const toast = useToast();
const email = ref('');
const loading = ref(false);
const submitted = ref(false);

const handleForgotPassword = async () => {
    loading.value = true;
    try {
        await authStore.forgotPassword(email.value);
        toast.add({ severity: 'success', summary: 'Email envoyé', detail: 'Si un compte existe, un email de réinitialisation a été envoyé.', life: 5000 });
        submitted.value = true;
    } catch(error) {
        toast.add({ severity: 'error', summary: 'Erreur', detail: error.response?.data?.message || 'Une erreur est survenue.', life: 3000 });
    } finally {
        loading.value = false;
    }
}
</script>

<template>
    <div class="auth-page">
        <Card class="auth-card">
            <template #title><h2 class="text-center">Mot de Passe Oublié</h2></template>
            <template #content>
                <div v-if="!submitted">
                    <p>Entrez votre adresse e-mail et nous vous enverrons un lien pour réinitialiser votre mot de passe.</p>
                    <form @submit.prevent="handleForgotPassword" class="p-fluid">
                        <div class="p-field">
                            <label for="email">Email</label>
                            <InputText id="email" v-model="email" type="email" />
                        </div>
                        <Button type="submit" label="Envoyer le lien" :loading="loading" />
                    </form>
                </div>
                <div v-else class="text-center">
                    <i class="pi pi-check-circle" style="font-size: 3rem; color: var(--green-500)"></i>
                    <h3>Vérifiez votre boîte mail</h3>
                    <p>Le lien de réinitialisation a été envoyé à <strong>{{ email }}</strong>.</p>
                </div>
            </template>
        </Card>
    </div>
</template>

<style scoped>
/* styles de auth-page et auth-card réutilisés */
.auth-page { display: flex; justify-content: center; align-items: center; padding: 2rem; }
.auth-card { width: 100%; max-width: 450px; }
.p-field { margin-bottom: 1.5rem; }
.text-center { text-align: center; }
</style>