<script setup>
import { ref, onMounted } from 'vue';
import api from '@/services/api';
import { useToast } from 'primevue/usetoast';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import Tag from 'primevue/tag';
import Tooltip from 'primevue/tooltip';
import Password from 'primevue/password';

const vTooltip = Tooltip;
const toast = useToast();
const users = ref([]);
const userDialog = ref(false);
const deleteDialog = ref(false);
const user = ref({});
const newPassword = ref('');
const loading = ref(true);
const totalRecords = ref(0);

// lazyParams est notre seule source de vérité pour la pagination
const lazyParams = ref({
  first: 0,  // L'index du premier élément à afficher
  rows: 5,   // Nombre d'éléments par page
  page: 1,   // La page actuelle (1-based index)
});

// FONCTION DE CHARGEMENT SIMPLIFIÉE
const loadUsers = async () => {
    loading.value = true;
    try {
        const response = await api.get('/admin/users', {
            params: { 
                page: lazyParams.value.page, 
                size: lazyParams.value.rows 
            }
        });
        users.value = response.data.data;
        totalRecords.value = response.data.totalItems;
    } catch(e) { 
        console.error("Erreur de chargement des utilisateurs:", e);
        toast.add({ severity: 'error', summary: 'Erreur', detail: 'Impossible de charger les utilisateurs.', life: 3000 });
    } finally { 
        loading.value = false; 
    }
};

onMounted(() => {
    loadUsers();
});

// L'événement @page met à jour notre source de vérité, puis on recharge
const onPage = (event) => {
    lazyParams.value.page = event.page + 1;
    lazyParams.value.rows = event.rows;
    lazyParams.value.first = event.first;
    loadUsers();
};

const editUser = (prod) => {
    user.value = { ...prod };
    newPassword.value = '';
    userDialog.value = true;
};

const confirmDeleteUser = (prod) => {
    user.value = prod;
    deleteDialog.value = true;
};

const saveUser = async () => {
    try {
        await api.put(`/admin/users/${user.value.id}`, {
            fullName: user.value.fullName,
            email: user.value.email,
            phoneNumber: user.value.phoneNumber,
            address: user.value.address
        });
        if (newPassword.value) {
            await api.put(`/admin/users/${user.value.id}/reset-password`, {
                newPassword: newPassword.value
            });
        }
        toast.add({ severity: 'success', summary: 'Succès', detail: 'Utilisateur mis à jour.', life: 3000 });
        userDialog.value = false;
        // L'appel est maintenant simple, il recharge simplement la page actuelle
        loadUsers(); 
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Erreur', detail: error.response?.data?.message || 'Opération échouée.', life: 4000 });
    }
};

const deleteUser = async () => {
    try {
        await api.delete(`/admin/users/${user.value.id}`);
        toast.add({ severity: 'success', summary: 'Succès', detail: 'Utilisateur supprimé.', life: 3000 });
        deleteDialog.value = false;
        // Si c'était le dernier item de la page, on retourne à la page précédente
        if (users.value.length === 1 && lazyParams.value.page > 1) {
            lazyParams.value.page--;
        }
        // Recharger les données
        loadUsers();
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Erreur', detail: error.response?.data?.message || 'Suppression échouée.', life: 4000 });
    }
};
</script>

<template>
  <div>
    <h1 class="section-title">Gestion des Utilisateurs</h1>
    <div class="card">
      <DataTable 
        :value="users" 
        :loading="loading" 
        :lazy="true"
        :paginator="true" 
        :rows="lazyParams.rows" 
        :totalRecords="totalRecords"
        :first="lazyParams.first"
        :rowsPerPageOptions="[5, 10, 20]"
        @page="onPage"
        responsiveLayout="scroll"
      >
        <Column field="id" header="ID" :sortable="true"></Column>
        <Column field="fullName" header="Nom" :sortable="true"></Column>
        <Column field="email" header="Email"></Column>
        <Column field="phoneNumber" header="Téléphone"></Column>
        <Column field="role" header="Rôle" :sortable="true">
          <template #body="slotProps">
            <Tag :value="slotProps.data.role" :severity="slotProps.data.role === 'admin' ? 'info' : 'secondary'" />
          </template>
        </Column>
        <Column header="Actions" style="width: 8rem; text-align: center;">
          <template #body="slotProps">
            <Button icon="pi pi-pencil" class="p-button-rounded p-button-success p-mr-2" @click="editUser(slotProps.data)" v-tooltip.top="'Modifier'" />
            <Button 
                icon="pi pi-trash" 
                class="p-button-rounded p-button-warning" 
                @click="confirmDeleteUser(slotProps.data)" 
                :disabled="slotProps.data.role === 'admin'" 
                v-tooltip.top="slotProps.data.role === 'admin' ? 'Suppression non autorisée' : 'Supprimer'" 
            />
          </template>
        </Column>
      </DataTable>
    </div>

    <Dialog v-model:visible="userDialog" :style="{width: '450px'}" header="Modifier l'Utilisateur" :modal="true" class="p-fluid">
        <div class="p-field">
            <label for="name">Nom</label>
            <InputText id="name" v-model="user.fullName" />
        </div>
        <div class="p-field">
            <label for="email">Email</label>
            <InputText id="email" v-model="user.email" />
        </div>
        <div class="p-field">
            <label for="phone">Téléphone</label>
            <InputText id="phone" v-model="user.phoneNumber" />
        </div>
        <div class="p-field">
            <label for="address">Adresse</label>
            <InputText id="address" v-model="user.address" />
        </div>
         <div class="p-field">
            <label for="password">Nouveau Mot de Passe</label>
            <Password id="password" v-model="newPassword" :feedback="false" toggleMask placeholder="Laisser vide pour ne pas changer" />
        </div>
        <template #footer>
            <Button label="Annuler" icon="pi pi-times" text @click="userDialog = false"/>
            <Button label="Sauvegarder" icon="pi pi-check" @click="saveUser"/>
        </template>
    </Dialog>

    <Dialog v-model:visible="deleteDialog" :style="{width: '450px'}" header="Confirmation" :modal="true">
        <div class="confirmation-content">
            <i class="pi pi-exclamation-triangle p-mr-3" style="font-size: 2rem" />
            <span>Êtes-vous sûr de vouloir supprimer <b>{{user.fullName}}</b> ?</span>
        </div>
        <template #footer>
            <Button label="Non" icon="pi pi-times" text @click="deleteDialog=false"/>
            <Button label="Oui" icon="pi pi-check" @click="deleteUser" />
        </template>
    </Dialog>
  </div>
</template>

<style scoped>
.p-field { margin-bottom: 1.5rem; }
.card { background: #ffffff; padding: 2rem; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
.confirmation-content { display: flex; align-items: center; }
</style>