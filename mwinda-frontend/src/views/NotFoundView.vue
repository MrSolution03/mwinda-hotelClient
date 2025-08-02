<script setup>
import Button from 'primevue/button';
</script>

<template>
  <div class="not-found-container">
    <div class="content">
      <h1 class="status-code">404</h1>
      <p class="message">Oups ! La page que vous cherchez n'existe pas.</p>
      <p class="suggestion">Il semble que vous vous soyez égaré. Pas de panique, nous pouvons vous ramener.</p>
      <Button label="Retour à l'accueil" icon="pi pi-home" @click="$router.push('/')" />
    </div>
  </div>
</template>

<style scoped>
.not-found-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(100vh - 120px); /* Hauteur de la vue moins le header et le footer */
  text-align: center;
  padding: 2rem;
}

.content {
  max-width: 600px;
}

.status-code {
  font-size: 8rem;
  font-weight: 900;
  color: #c7d2fe;
  margin: 0;
}

.message {
  font-size: 1.75rem;
  font-weight: 600;
  color: #334155;
  margin-top: -1rem; /* Pour se superposer légèrement au 404 */
  margin-bottom: 1rem;
}

.suggestion {
  font-size: 1.1rem;
  color: #64748b;
  margin-bottom: 2rem;
}
</style>