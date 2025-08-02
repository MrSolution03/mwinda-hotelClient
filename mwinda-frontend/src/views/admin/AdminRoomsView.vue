<script setup>
import { ref, onMounted } from 'vue';
import api from '@/services/api';
import { useToast } from 'primevue/usetoast';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import InputNumber from 'primevue/inputnumber';
import Dropdown from 'primevue/dropdown';
import FileUpload from 'primevue/fileupload';
import Tag from 'primevue/tag';
import Image from 'primevue/image';
import Tooltip from 'primevue/tooltip';

const vTooltip = Tooltip;
const toast = useToast();
const rooms = ref([]);
const loading = ref(true);
const roomDialog = ref(false);
const deleteDialog = ref(false);
const room = ref({});
const isEdit = ref(false);
const filesToUpload = ref([]);
const existingImages = ref([]);
const totalRecords = ref(0);
// lazyParams est notre source de vérité pour la pagination
const lazyParams = ref({
  first: 0,
  rows: 5,
  page: 1,
});

const roomStatuses = ref(['disponible', 'occupée', 'maintenance']);
// La variable baseURL n'est plus nécessaire

const loadRooms = async () => {
    loading.value = true;
    try {
        const response = await api.get('/rooms', {
            params: { 
                page: lazyParams.value.page, 
                size: lazyParams.value.rows 
            }
        });
        rooms.value = response.data.rooms;
        totalRecords.value = response.data.totalItems;
    } catch(e) { console.error(e) } 
    finally { loading.value = false; }
};

onMounted(loadRooms);

const onPage = (event) => {
    lazyParams.value.page = event.page + 1;
    lazyParams.value.rows = event.rows;
    lazyParams.value.first = event.first;
    loadRooms();
};

const openNew = () => {
    room.value = { amenities: [''] };
    isEdit.value = false;
    roomDialog.value = true;
};

const editRoom = (prod) => {
    let roomToEdit = { ...prod };
    roomToEdit.pricePerNight = parseFloat(prod.pricePerNight);
    roomToEdit.amenities = Array.isArray(prod.amenities) ? [...prod.amenities] : [];
    room.value = roomToEdit;
    existingImages.value = prod.images || [];
    isEdit.value = true;
    roomDialog.value = true;
};

const removeExistingImage = async (imageId) => {
    try {
        await api.delete(`/rooms/image/${imageId}`);
        existingImages.value = existingImages.value.filter(img => img.id !== imageId);
        toast.add({ severity: 'success', summary: 'Succès', detail: 'Image supprimée.', life: 3000 });
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Erreur', detail: 'Impossible de supprimer l\'image.', life: 3000 });
    }
};

const confirmDeleteRoom = (prod) => {
    room.value = prod;
    deleteDialog.value = true;
};

const hideDialog = () => {
    roomDialog.value = false;
    filesToUpload.value = [];
    existingImages.value = [];
};

const onFileSelect = (event) => {
    filesToUpload.value = event.files;
};

const saveRoom = async () => {
    try {
        const formData = new FormData();
        formData.append('type', room.value.type);
        formData.append('pricePerNight', room.value.pricePerNight);
        formData.append('description', room.value.description || '');
        formData.append('status', room.value.status || 'disponible');
        formData.append('amenities', JSON.stringify(room.value.amenities.filter(a => a)));

        filesToUpload.value.forEach(file => {
            formData.append('images', file);
        });
        
        const config = { headers: { 'Content-Type': 'multipart/form-data' } };

        if (isEdit.value) {
            await api.put(`/rooms/${room.value.id}`, formData, config);
            toast.add({ severity: 'success', summary: 'Succès', detail: 'Chambre mise à jour', life: 3000 });
        } else {
            await api.post('/rooms', formData, config);
            toast.add({ severity: 'success', summary: 'Succès', detail: 'Chambre créée', life: 3000 });
        }
        
        hideDialog();
        loadRooms();
    } catch (error) {
        console.error(error);
        toast.add({ severity: 'error', summary: 'Erreur', detail: 'Opération échouée', life: 3000 });
    }
};

const deleteRoom = async () => {
    try {
        await api.delete(`/rooms/${room.value.id}`);
        toast.add({ severity: 'success', summary: 'Succès', detail: 'Chambre supprimée', life: 3000 });
        deleteDialog.value = false;
        if (rooms.value.length === 1 && lazyParams.value.page > 1) {
            lazyParams.value.page--;
        }
        loadRooms();
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Erreur', detail: 'Suppression échouée', life: 3000 });
    }
};

const getStatusSeverity = (status) => {
    switch (status) {
        case 'disponible': return 'success';
        case 'occupée': return 'warning';
        case 'maintenance': return 'danger';
    }
};

const addAmenity = () => {
    if (!room.value.amenities) {
        room.value.amenities = [];
    }
    room.value.amenities.push('');
};
const removeAmenity = (index) => {
    room.value.amenities.splice(index, 1);
};
</script>

<template>
  <div>
    <h1 class="section-title">Gestion des Chambres</h1>
    <div class="card">
        <div class="toolbar">
            <Button label="Nouvelle Chambre" icon="pi pi-plus" @click="openNew"/>
        </div>

        <DataTable 
          :value="rooms" 
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
          <Column header="Image">
              <template #body="slotProps">
                  <!-- CORRECTION : Utilisation directe de l'URL Cloudinary -->
                  <Image v-if="slotProps.data.images && slotProps.data.images.length > 0" :src="slotProps.data.images[0].url" :alt="slotProps.data.type" width="80" preview />
              </template>
          </Column>
          <Column field="type" header="Type" :sortable="true"></Column>
          <Column field="pricePerNight" header="Prix/Nuit" :sortable="true">
              <template #body="slotProps">{{ slotProps.data.pricePerNight }} USD</template>
          </Column>
          <Column field="status" header="Statut" :sortable="true">
               <template #body="slotProps"><Tag :value="slotProps.data.status" :severity="getStatusSeverity(slotProps.data.status)" /></template>
          </Column>
          <Column header="Actions">
              <template #body="slotProps">
                  <Button icon="pi pi-pencil" class="p-button-rounded p-button-success p-mr-2" @click="editRoom(slotProps.data)" v-tooltip.top="'Modifier'"/>
                  <Button icon="pi pi-trash" class="p-button-rounded p-button-warning" @click="confirmDeleteRoom(slotProps.data)" v-tooltip.top="'Supprimer'"/>
              </template>
          </Column>
        </DataTable>
    </div>

    <Dialog v-model:visible="roomDialog" :style="{width: '600px'}" :header="isEdit ? 'Modifier la Chambre' : 'Nouvelle Chambre'" :modal="true" class="p-fluid" @hide="hideDialog">
        <div class="p-field">
            <label for="type">Type</label>
            <InputText id="type" v-model.trim="room.type" required="true" />
        </div>
        <div class="p-field">
            <label for="price">Prix / Nuit</label>
            <InputNumber id="price" v-model="room.pricePerNight" mode="currency" currency="USD" locale="en-US" />
        </div>
        <div class="p-field">
            <label for="status">Statut</label>
            <Dropdown id="status" v-model="room.status" :options="roomStatuses" placeholder="Choisir un statut" />
        </div>
        <div class="p-field">
            <label for="desc">Description</label>
            <Textarea id="desc" v-model="room.description" rows="3" autoResize />
        </div>
        
        <div class="p-field">
            <label>Avantages</label>
            <div v-for="(amenity, index) in room.amenities" :key="index" class="dynamic-field">
                <InputText v-model="room.amenities[index]" placeholder="ex: Wi-Fi gratuit" />
                <Button icon="pi pi-minus" class="p-button-danger p-button-sm" @click="removeAmenity(index)" />
            </div>
            <Button label="Ajouter un avantage" icon="pi pi-plus" class="p-button-text p-button-sm" @click="addAmenity" />
        </div>

        <div v-if="isEdit && existingImages.length > 0" class="p-field">
            <label>Images Actuelles</label>
            <div class="existing-images-grid">
                <div v-for="image in existingImages" :key="image.id" class="existing-image-container">
                    <!-- CORRECTION : Utilisation directe de l'URL Cloudinary -->
                    <Image :src="image.url" alt="Image de la chambre" width="100" preview />
                    <Button icon="pi pi-times" class="p-button-danger p-button-rounded p-button-sm remove-image-btn" @click="removeExistingImage(image.id)" v-tooltip.top="'Supprimer cette image'"/>
                </div>
            </div>
        </div>

        <div class="p-field">
            <label>Ajouter de Nouvelles Images</label>
            <FileUpload name="images[]" @select="onFileSelect" :multiple="true" accept="image/*" :maxFileSize="2000000" :auto="false" :customUpload="true" chooseLabel="Choisir des fichiers" :showUploadButton="false" :showCancelButton="false">
                <template #empty><p>Glissez-déposez les fichiers ici.</p></template>
            </FileUpload>
            <small>Les nouveaux fichiers seront ajoutés aux images existantes.</small>
        </div>
        
        <template #footer>
            <Button label="Annuler" icon="pi pi-times" text @click="hideDialog"/>
            <Button label="Sauvegarder" icon="pi pi-check" @click="saveRoom" />
        </template>
    </Dialog>

    <Dialog v-model:visible="deleteDialog" :style="{width: '450px'}" header="Confirmation" :modal="true">
        <div class="confirmation-content">
            <i class="pi pi-exclamation-triangle p-mr-3" style="font-size: 2rem" />
            <span v-if="room">Êtes-vous sûr de vouloir supprimer la chambre <b>{{room.type}}</b> ?</span>
        </div>
        <template #footer>
            <Button label="Non" icon="pi pi-times" text @click="deleteDialog = false"/>
            <Button label="Oui" icon="pi pi-check" @click="deleteRoom" />
        </template>
    </Dialog>
  </div>
</template>

<style scoped>
.card { background: #ffffff; padding: 2rem; border-radius: 10px; margin-bottom: 2rem; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
.toolbar { margin-bottom: 1rem; }
.p-field { margin-bottom: 1.5rem; }
.confirmation-content { display: flex; align-items: center; }
.dynamic-field { display: flex; gap: 0.5rem; margin-bottom: 0.5rem; }
.dynamic-field .p-inputtext { flex-grow: 1; }
.existing-images-grid { display: flex; flex-wrap: wrap; gap: 1rem; padding: 0.5rem; border: 1px solid #dee2e6; border-radius: 6px; }
.existing-image-container { position: relative; }
.remove-image-btn { position: absolute; top: -10px; right: -10px; width: 1.5rem !important; height: 1.5rem !important; }
</style>