<script setup>
import Card from 'primevue/card';
import Button from 'primevue/button';
import { ref } from 'vue';

// Les valeurs et engagements de l'hôtel
const values = ref([
  {
    icon: 'pi pi-star-fill',
    title: 'Confort Inégalé',
    text: 'Chacune de nos chambres est conçue pour être un sanctuaire de paix, alliant design moderne et confort absolu.'
  },
  {
    icon: 'pi pi-map-marker',
    title: 'Emplacement Stratégique',
    text: 'Situé au cœur de Kolwezi, notre hôtel offre un accès facile aux centres d\'affaires et aux points d\'intérêt de la ville.'
  },
  {
    icon: 'pi pi-users',
    title: 'Service d\'Excellence',
    text: 'Notre personnel dévoué est formé pour anticiper vos besoins et vous offrir une expérience personnalisée et mémorable.'
  },
  {
    icon: 'pi pi-shield',
    title: 'Sécurité Garantie',
    text: 'Votre tranquillité d\'esprit est notre priorité. Nous assurons une sécurité discrète et efficace 24h/24 et 7j/7.'
  }
]);
</script>

<template>
  <div class="about-view">
    <div class="hero-section">
      <div class="container">
        <h1 class="hero-title">Notre Histoire, Votre Confort</h1>
        <p class="hero-subtitle">Plus qu'un hôtel, une expérience au cœur du Lualaba.</p>
      </div>
    </div>

    <div class="container content-section">
      <div class="about-grid">
        <div class="text-content">
          <h2 class="section-title">Bienvenue à Mwinda Hotel</h2>
          <p>
            Niché au cœur battant de <strong>Kolwezi</strong>, capitale de la province du Lualaba, Mwinda Hotel est bien plus qu'un simple lieu de séjour ; c'est un havre de paix conçu pour les voyageurs modernes. Que vous soyez ici pour les affaires ou pour découvrir les richesses de la région, notre mission est de rendre votre séjour exceptionnel.
          </p>
          <p>
            Nous combinons l'hospitalité congolaise authentique avec des standards internationaux d'excellence pour créer une atmosphère à la fois accueillante et raffinée. Notre établissement est une porte d'entrée sur le dynamisme de Kolwezi, offrant un refuge luxueux après une journée de travail ou d'exploration.
          </p>
        </div>
        <div class="image-content">
          <img src="https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=1770&auto=format&fit=crop" alt="Intérieur d'une chambre d'hôtel moderne" class="about-image">
        </div>
      </div>
    </div>

    <div class="values-section">
      <div class="container">
        <h2 class="section-title dark-bg-title">Nos Engagements</h2>
        <div class="values-grid">
          <Card v-for="value in values" :key="value.title" class="value-card">
            <template #content>
              <i :class="value.icon" class="value-icon"></i>
              <h3 class="value-title">{{ value.title }}</h3>
              <p class="value-text">{{ value.text }}</p>
            </template>
          </Card>
        </div>
      </div>
    </div>

    <div class="cta-section">
      <div class="container">
        <h2 class="cta-title">Prêt pour une expérience unique ?</h2>
        <Button label="Découvrez nos chambres" size="large" @click="$router.push('/chambres')" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.about-view {
  background-color: #fff;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.hero-section {
  background-color: #1e293b;
  color: white;
  padding: 4rem 0;
  text-align: center;
}

.hero-title {
  font-size: 3rem;
  font-weight: 800;
}

.hero-subtitle {
  font-size: 1.2rem;
  color: #cbd5e1;
}

.content-section {
  padding: 4rem 1rem;
}

.about-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  align-items: center;
}

.section-title {
  font-size: 2.2rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 1.5rem;
}

.text-content p {
  font-size: 1.1rem;
  line-height: 1.7;
  color: #475569;
  margin-bottom: 1rem;
}

.image-content {
  text-align: center;
}

.about-image {
  width: 100%;
  border-radius: 12px;
  box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04);
}

.values-section {
  background-color: #f1f5f9;
  padding: 4rem 0;
}

.dark-bg-title {
  text-align: center;
}

.values-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
}

.value-card {
  text-align: center;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
}

.value-icon {
  font-size: 2.5rem;
  color: #4f46e5;
  margin-bottom: 1rem;
}

.value-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: #1e293b;
}

.value-text {
  font-size: 0.95rem;
  color: #64748b;
  line-height: 1.6;
}

.cta-section {
  padding: 4rem 0;
  text-align: center;
  background-color: #fff;
}

.cta-title {
  font-size: 1.8rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
}

@media (max-width: 992px) {
  .about-grid {
    grid-template-columns: 1fr;
  }
}
</style>