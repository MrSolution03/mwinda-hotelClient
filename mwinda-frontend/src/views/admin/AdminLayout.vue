<!-- src/views/admin/AdminLayout.vue -->
<template>
  <div class="admin-layout">
    <aside class="sidebar">
      <nav class="admin-nav">
        <RouterLink to="/admin/dashboard" class="nav-item">
          <i class="pi pi-th-large"></i>
          <span>Tableau de Bord</span>
        </RouterLink>
        <RouterLink to="/admin/chambres" class="nav-item">
          <i class="pi pi-building"></i>
          <span>Chambres</span>
        </RouterLink>
         <RouterLink to="/admin/utilisateurs" class="nav-item">
          <i class="pi pi-users"></i>
          <span>Utilisateurs</span>
        </RouterLink>
         <RouterLink to="/admin/paiements" class="nav-item">
          <i class="pi pi-dollar"></i>
          <span>Paiements</span>
        </RouterLink>
        <RouterLink to="/admin/factures" class="nav-item">
          <i class="pi pi-file-pdf"></i>
          <span>Factures</span>
        </RouterLink>
      </nav>
    </aside>
    <main class="admin-content">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.admin-layout {
  display: flex;
  min-height: calc(100vh - 105px); /* Hauteur moins header/footer approx. */
}
.sidebar {
  width: 250px;
  background-color: #1e293b;
  color: #e2e8f0;
  padding: 1rem;
  flex-shrink: 0; /* Empêche la sidebar de se compresser */
  transition: margin-left 0.3s ease; /* Ajoute une transition douce */
}
.admin-nav {
  display: flex;
  flex-direction: column;
}
.nav-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 1rem;
  text-decoration: none;
  color: #cbd5e1;
  border-radius: 6px;
  transition: background-color 0.2s;
}
.nav-item:hover {
  background-color: #334155;
}
.nav-item.router-link-exact-active {
  background-color: #4f46e5;
  color: white;
}
.admin-content {
  flex-grow: 1;
  padding: 2rem;
  background-color: #f1f5f9;
  width: 100%;
}

/* --- SECTION RESPONSIVE --- */
/* C'est le bloc qui fait le travail */
@media (max-width: 992px) { 
  .sidebar {
    /* Cache complètement la sidebar sur les écrans plus petits */
    display: none; 
  }
  .admin-content {
    /* Réduit le padding pour optimiser l'espace sur mobile */
    padding: 1rem; 
  }
}
</style>