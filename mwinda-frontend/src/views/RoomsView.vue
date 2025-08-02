<script setup>
import { ref, onMounted, watch } from 'vue';
import roomService from '@/services/roomService';
import Paginator from 'primevue/paginator';
import Slider from 'primevue/slider';
import Dropdown from 'primevue/dropdown';
import Card from 'primevue/card';
import Button from 'primevue/button';
import Skeleton from 'primevue/skeleton';
import Message from 'primevue/message';

const rooms = ref([]);
const loading = ref(true);
const error = ref(null);
const totalRecords = ref(0);
const currentPage = ref(1);
const rowsPerPage = ref(8);

const filters = ref({
  type: null,
  priceRange: [0, 500]
});

const roomTypes = ref([]);
// La variable baseURL n'est plus nécessaire

const fetchRooms = async () => {
  loading.value = true;
  error.value = null;
  try {
    const params = {
      page: currentPage.value,
      size: rowsPerPage.value,
      type: filters.value.type || undefined,
      minPrice: filters.value.priceRange[0],
      maxPrice: filters.value.priceRange[1] >= 500 ? undefined : filters.value.priceRange[1],
    };
    const response = await roomService.getRooms(params);
    rooms.value = response.data.rooms;
    totalRecords.value = response.data.totalItems;
  } catch (err) {
    console.error("Erreur de chargement des chambres:", err);
    error.value = "Impossible de charger les chambres.";
  } finally {
    loading.value = false;
  }
};

const fetchRoomTypes = async () => {
    try {
        const response = await roomService.getRoomTypes();
        roomTypes.value = [{ label: 'Tous les types', value: null }, ...response.data.map(type => ({ label: type, value: type }))];
    } catch (err) {
        console.error("Erreur de chargement des types:", err);
    }
}

onMounted(() => {
    fetchRooms();
    fetchRoomTypes();
});

const onPageChange = (event) => {
  currentPage.value = event.page + 1;
  rowsPerPage.value = event.rows;
  fetchRooms();
};

watch(filters, () => {
  currentPage.value = 1;
  fetchRooms();
}, { deep: true });
</script>

<template>
  <div class="container">
    <h1 class="section-title">Nos Chambres Disponibles</h1>

    <Card class="filter-card">
      <template #content>
        <div class="filter-bar">
            <Dropdown v-model="filters.type" :options="roomTypes" optionLabel="label" optionValue="value" placeholder="Type de chambre" style="width: 250px;" />
            <div class="price-filter">
                <span>Prix: {{ filters.priceRange[0] }} - {{ filters.priceRange[1] >= 500 ? '500+' : filters.priceRange[1] }} USD</span>
                <Slider v-model="filters.priceRange" :range="true" :min="0" :max="500" />
            </div>
        </div>
      </template>
    </Card>

    <div class="content-wrapper">
      <div v-if="loading" class="rooms-grid">
        <div v-for="n in rowsPerPage" :key="n"><Skeleton height="420px" borderRadius="10px" /></div>
      </div>
      <div v-else-if="error"><Message severity="error" :closable="false">{{ error }}</Message></div>
      <div v-else-if="rooms.length === 0"><Message severity="info" :closable="false">Aucune chambre ne correspond à vos critères.</Message></div>
      
      <div v-else class="rooms-grid">
        <Card v-for="room in rooms" :key="room.id" class="room-card">
          <template #header>
            <!-- CORRECTION : On utilise directement l'URL de l'image de Cloudinary -->
            <img 
              :src="(room.images && room.images.length > 0) ? room.images[0].url : 'https://via.placeholder.com/400x250?text=Mwinda+Hotel'"
              :alt="room.type"
              class="room-image"
            />
          </template>
          <template #title>{{ room.type || 'Type non défini' }}</template>
          <template #subtitle>{{ room.pricePerNight }} USD / nuit</template>
          <template #content>
            <p>{{ (room.description || '').substring(0, 100) }}...</p>
          </template>
          <template #footer>
            <Button 
              label="Voir détails & Réserver" 
              icon="pi pi-arrow-right" 
              @click="$router.push(`/chambres/${room.id}`)" 
            />
          </template>
        </Card>
      </div>

      <Paginator 
        v-if="!loading && !error && totalRecords > rowsPerPage"
        :first="(currentPage - 1) * rowsPerPage"
        :rows="rowsPerPage" 
        :rowsPerPageOptions="[4, 8, 12, 16]"
        :totalRecords="totalRecords" 
        @page="onPageChange" 
        class="paginator-style"
      />
    </div>
  </div>
</template>

<style scoped>
.container { max-width: 1400px; margin: 0 auto; padding: 1rem; }
.section-title { text-align: center; margin-bottom: 2rem; }
.filter-card { margin-bottom: 2rem; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
.filter-bar { display: flex; flex-wrap: wrap; gap: 2rem; align-items: center; }
.price-filter { width: 300px; }
.rooms-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 1.5rem; }
.room-card { height: 100%; display: flex; flex-direction: column; transition: all 0.3s ease; }
.room-card:hover { transform: translateY(-5px); box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); }
.room-image { width: 100%; height: 200px; object-fit: cover; }
.p-card-content { flex-grow: 1; }
.paginator-style { margin-top: 2rem; }
</style>