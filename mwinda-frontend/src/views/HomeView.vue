<script setup>
import { ref, onMounted } from 'vue';
import api from '@/services/api';
import { useAuthStore } from '@/stores/auth';
import Card from 'primevue/card';
import Button from 'primevue/button';
import Carousel from 'primevue/carousel';

const authStore = useAuthStore();
const featuredRooms = ref([]);
// La variable baseURL n'est plus nécessaire ici

const testimonials = ref([
  { name: 'Aline K.', text: 'Un séjour inoubliable ! Le service était impeccable et la chambre magnifique.', rating: 5 },
  { name: 'David M.', text: 'Très bien situé, l\'hôtel est parfait pour les voyages d\'affaires. Je reviendrai.', rating: 5 },
  { name: 'Fatou B.', text: 'J\'ai adoré la vue depuis ma chambre et le petit-déjeuner était délicieux.', rating: 4 },
]);

onMounted(async () => {
  try {
    const response = await api.get('/rooms?size=3');
    featuredRooms.value = response.data.rooms;
  } catch (error) {
    console.error("Impossible de charger les chambres:", error);
  }
});

const getRating = (rating) => '⭐'.repeat(rating);
</script>

<template>
  <div class="home-view">
    <section class="hero">
      <div class="hero-overlay">
        <div class="hero-text">
          <h1>Bienvenue à Mwinda Hotel</h1>
          <p>L'excellence de l'hospitalité au cœur de la RDC.</p>
          <Button label="Voir nos chambres" size="large" @click="$router.push('/chambres')" />
        </div>
      </div>
    </section>

    <div class="container">
      <section class="featured-rooms">
        <h2 class="section-title">Nos plus belles chambres</h2>
        <div class="rooms-grid">
          <div v-for="room in featuredRooms" :key="room.id">
            <Card class="room-card">
              <template #header>
                <!-- CORRECTION : On utilise directement l'URL de l'image -->
                <img 
                  :alt="room.type" 
                  :src="(room.images && room.images.length > 0) ? room.images[0].url : 'https://via.placeholder.com/400x250?text=Mwinda+Hotel'" 
                  class="room-image"
                />
              </template>
              <template #title>{{ room.type }}</template>
              <template #subtitle>{{ room.pricePerNight }} USD / nuit</template>
              <template #footer>
                <Button 
                  label="Voir détails & Réserver" 
                  icon="pi pi-arrow-right" 
                  @click="$router.push(`/chambres/${room.id}`)" 
                />
              </template>
            </Card>
          </div>
        </div>
      </section>

      <section class="testimonials">
        <h2 class="section-title">Ce que nos clients disent</h2>
        <Carousel :value="testimonials" :numVisible="1" :numScroll="1" circular :autoplayInterval="5000">
          <template #item="slotProps">
            <div class="testimonial-card">
              <p class="testimonial-text">"{{ slotProps.data.text }}"</p>
              <div class="testimonial-author">
                <span class="author-name">{{ slotProps.data.name }}</span>
                <span class="author-rating">{{ getRating(slotProps.data.rating) }}</span>
              </div>
            </div>
          </template>
        </Carousel>
      </section>
    </div>
  </div>
</template>

<style scoped>
.hero {
  position: relative;
  height: 70vh;
  background: url('https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop') no-repeat center center/cover;
}
.hero-overlay {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  background-color: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  text-align: center;
}
.hero-text h1 { font-size: 3.5rem; color:#fff }
.hero-text p { font-size: 1.2rem; margin-bottom: 2rem; }
.featured-rooms, .testimonials { padding: 4rem 0; }
.rooms-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 1.5rem; }
.room-card { height: 100%; }
.room-image { width: 100%; height: 200px; object-fit: cover; }
.testimonial-card { margin: 1rem 2rem; padding: 2rem; background-color: #fff; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); text-align: center; }
.testimonial-text { font-style: italic; font-size: 1.1rem; }
.testimonial-author { margin-top: 1rem; }
.author-name { font-weight: bold; }
.author-rating { margin-left: 1rem; color: #f59e0b; }
</style>