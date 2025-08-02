<script setup>
import { ref, onMounted } from 'vue';
import api from '@/services/api';
import Card from 'primevue/card';
import Skeleton from 'primevue/skeleton';
import Message from 'primevue/message';
import { RouterLink } from 'vue-router'; // Importer RouterLink

const stats = ref(null);
const loading = ref(true);
const error = ref(null);

const formatCurrency = (value) => {
  if (value === null || value === undefined) return '0,00 USD';
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'USD' }).format(value);
};

onMounted(async () => {
    try {
        const response = await api.get('/dashboard/stats');
        stats.value = response.data;
    } catch(err) {
        console.error("Erreur de chargement du tableau de bord:", err);
        error.value = "Impossible de charger les statistiques. Veuillez réessayer plus tard.";
    } finally {
        loading.value = false;
    }
});
</script>

<template>
  <div>
    <h1 class="section-title">Tableau de Bord Administrateur</h1>

    <!-- État de chargement -->
    <div v-if="loading" class="stats-grid">
      <Card v-for="n in 6" :key="n">
        <template #title><Skeleton width="60%" height="2rem" /></template>
        <template #content><Skeleton width="40%" height="3rem" /></template>
      </Card>
    </div>

    <!-- État d'erreur -->
    <div v-else-if="error">
        <Message severity="error" :closable="false">{{ error }}</Message>
    </div>

    <!-- État de succès avec cartes cliquables -->
    <div v-else-if="stats" class="stats-grid">
      <RouterLink to="/admin/paiements" class="stat-link">
        <Card class="stat-card">
          <template #title><i class="pi pi-globe p-mr-2"/>Revenu Total</template>
          <template #content><p class="stat-value">{{ formatCurrency(stats.totalRevenue) }}</p></template>
        </Card>
      </RouterLink>
      
      <RouterLink to="/admin/paiements" class="stat-link">
        <Card class="stat-card">
          <template #title><i class="pi pi-calendar p-mr-2"/>Revenu Mensuel</template>
          <template #content><p class="stat-value">{{ formatCurrency(stats.monthlyRevenue) }}</p></template>
        </Card>
      </RouterLink>

      <RouterLink to="/admin/paiements" class="stat-link">
        <Card class="stat-card">
          <template #title><i class="pi pi-check-circle p-mr-2"/>Réservations Confirmées</template>
          <template #content><p class="stat-value">{{ stats.totalConfirmedBookings }}</p></template>
        </Card>
      </RouterLink>

      <RouterLink to="/admin/chambres" class="stat-link">
        <Card class="stat-card">
          <template #title><i class="pi pi-chart-line p-mr-2"/>Taux d'Occupation</template>
          <template #content><p class="stat-value">{{ stats.occupancyRate }} %</p></template>
        </Card>
      </RouterLink>

      <RouterLink to="/admin/chambres" class="stat-link">
        <Card class="stat-card">
          <template #title><i class="pi pi-building p-mr-2"/>Chambres Occupées</template>
          <template #content><p class="stat-value">{{ stats.currentlyOccupiedRooms }} / {{ stats.totalRooms }}</p></template>
        </Card>
      </RouterLink>

      <RouterLink to="/admin/utilisateurs" class="stat-link">
        <Card class="stat-card">
          <template #title><i class="pi pi-user-plus p-mr-2"/>Nouveaux Clients (jour)</template>
          <template #content><p class="stat-value">{{ stats.newClientsToday }}</p></template>
        </Card>
      </RouterLink>
    </div>
  </div>
</template>

<style scoped>
.stats-grid { 
  display: grid; 
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); 
  gap: 1.5rem; 
}

/* NOUVEAUX STYLES POUR LES LIENS */
.stat-link {
  text-decoration: none;
}

.stat-card {
  height: 100%;
  transition: all 0.3s ease;
  border: 1px solid transparent;
}

.stat-link:hover .stat-card {
  transform: translateY(-5px);
  box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);
  border-color: #c7d2fe;
}
/* FIN DES NOUVEAUX STYLES */


.stat-card .p-card-title {
    display: flex;
    align-items: center;
    font-size: 1.1rem;
    font-weight: 600;
    color: #475569;
}

.stat-card i {
    font-size: 1.2rem;
    margin-right: 0.75rem;
    color: #4f46e5;
}

.stat-value { 
  font-size: 2.2rem; 
  font-weight: 700; 
  color: #1e293b; 
  margin: 0; 
}
</style>