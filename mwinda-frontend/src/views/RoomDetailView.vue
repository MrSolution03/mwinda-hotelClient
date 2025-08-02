<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useToast } from 'primevue/usetoast';
import roomService from '@/services/roomService';
import api from '@/services/api';
import Galleria from 'primevue/galleria';
import Calendar from 'primevue/calendar';
import Button from 'primevue/button';
import Tag from 'primevue/tag';
import ProgressSpinner from 'primevue/progressspinner';
import Message from 'primevue/message';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const toast = useToast();
const room = ref(null);
const loading = ref(true);
const bookingLoading = ref(false);
const dates = ref();
// La variable baseURL est supprimée, car elle n'est plus nécessaire

const parsedAmenities = computed(() => {
  if (room.value && Array.isArray(room.value.amenities)) {
    return room.value.amenities;
  }
  return [];
});

const isBookingDisabled = computed(() => {
  return !dates.value || dates.value.length !== 2 || !dates.value[1];
});

const handleBooking = async () => {
  if (!authStore.isAuthenticated) {
    toast.add({ severity: 'info', summary: 'Connexion requise', detail: 'Veuillez vous connecter pour pouvoir réserver.', life: 4000 });
    router.push('/connexion');
    return;
  }

  bookingLoading.value = true;
  try {
    const payload = {
      roomId: room.value.id,
      arrivalDate: dates.value[0],
      departureDate: dates.value[1]
    };
    await api.post('/bookings', payload);
    toast.add({ severity: 'success', summary: 'Réservation initiée', detail: 'Veuillez finaliser le paiement depuis votre profil.', life: 5000 });
    router.push('/profil');
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Erreur', detail: error.response?.data?.message || 'Impossible de créer la réservation.', life: 4000 });
  } finally {
    bookingLoading.value = false;
  }
};

onMounted(async () => {
  try {
    const response = await roomService.getRoomById(route.params.id);
    room.value = response.data;
  } catch (error) {
    console.error("Erreur de chargement des détails de la chambre:", error);
  } finally {
    loading.value = false;
  }
});
</script>

<template>
    <div class="container page-spinner" v-if="loading">
        <ProgressSpinner />
    </div>
    <div class="container" v-else-if="room">
        <div class="room-detail-grid">
            <div class="room-gallery">
                <Galleria :value="room.images" :numVisible="5" :circular="true" :showThumbnails="true" :showItemNavigators="true">
                    <template #item="slotProps">
                        <!-- CORRECTION : On utilise directement l'URL de l'image de Cloudinary -->
                        <img :src="slotProps.item.url" :alt="room.type" class="main-gallery-image" />
                    </template>
                    <template #thumbnail="slotProps">
                         <!-- CORRECTION : On utilise directement l'URL de l'image de Cloudinary -->
                        <img :src="slotProps.item.url" :alt="room.type" class="thumbnail-gallery-image" />
                    </template>
                </Galleria>
            </div>
            <div class="room-info">
                <h1>{{ room.type }}</h1>
                <Tag :value="room.status" :severity="room.status === 'disponible' ? 'success' : 'danger'" />
                <p class="price">{{ room.pricePerNight }} USD <span class="per-night">/ nuit</span></p>
                <p class="description">{{ room.description }}</p>
                
                <h3>Avantages inclus</h3>
                <ul class="amenities">
                    <li v-for="amenity in parsedAmenities" :key="amenity"><i class="pi pi-check-circle"></i> {{ amenity }}</li>
                </ul>

                <div v-if="!authStore.isAdmin" class="booking-section">
                    <h3>Réserver votre séjour</h3>
                    <Calendar v-model="dates" selectionMode="range" :manualInput="false" placeholder="Sélectionnez vos dates" dateFormat="dd/mm/yy" />
                    <Button 
                        label="Réserver maintenant" 
                        icon="pi pi-calendar" 
                        @click="handleBooking" 
                        :disabled="isBookingDisabled || room.status !== 'disponible'" 
                        :loading="bookingLoading" 
                        class="p-mt-2" 
                    />
                    <small v-if="!authStore.isAuthenticated" class="p-mt-2 d-block">Vous devez être connecté pour réserver.</small>
                </div>
            </div>
        </div>
    </div>
    <div v-else class="container">
        <Message severity="error">Cette chambre n'a pas pu être trouvée.</Message>
    </div>
</template>

<style scoped>
.page-spinner { display: flex; justify-content: center; padding-top: 5rem; }
.room-detail-grid { display: grid; grid-template-columns: minmax(0, 3fr) minmax(0, 2fr); gap: 3rem; margin-top: 2rem; }
.price { font-size: 2rem; font-weight: bold; color: #4f46e5; margin: 1rem 0; }
.per-night { font-size: 1rem; font-weight: normal; color: #64748b; }
.description { line-height: 1.6; color: #475569; }
.amenities { list-style: none; padding: 0; }
.amenities li { margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.5rem; }
.pi-check-circle { color: #10b981; }
.booking-section { margin-top: 2rem; padding: 1.5rem; background: #f1f5f9; border-radius: 8px; }
.d-block { display: block; }

.room-gallery {
    width: 100%;
}
.main-gallery-image {
    width: 100%;
    height: 450px;
    object-fit: cover;
    display: block;
    border-radius: 12px;
    box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);
}
.thumbnail-gallery-image {
    width: 100px;
    height: 60px;
    object-fit: cover;
    display: block;
    border-radius: 6px;
}

:deep(.p-galleria-item-container) {
    margin-bottom: 1rem;
}
:deep(.p-galleria-thumbnail-container) {
    background: #f8f9fa;
    padding: 0.5rem;
    border-radius: 8px;
}
:deep(.p-galleria-thumbnail-item) {
    padding: 0.25rem;
}
:deep(.p-galleria-thumbnail-item.p-galleria-thumbnail-item-current) {
    outline: 2px solid #4f46e5;
    outline-offset: 2px;
    border-radius: 6px;
}

@media (max-width: 992px) {
    .room-detail-grid { grid-template-columns: 1fr; }
}
</style>