<script setup>
import { ref, watch, computed, onMounted, onBeforeUnmount } from 'vue';
import { RouterView, RouterLink, useRoute } from 'vue-router';
import { useAuthStore } from './stores/auth';
import Button from 'primevue/button';
import Toast from 'primevue/toast';

const authStore = useAuthStore();
const route = useRoute();

const isUserMenuOpen = ref(false);
const isMobileMenuOpen = ref(false);

const isAdminSection = computed(() => route.path.startsWith('/admin'));

const handleLogout = () => {
  isUserMenuOpen.value = false;
  isMobileMenuOpen.value = false;
  authStore.logout();
};

const closeMenus = () => {
    isUserMenuOpen.value = false;
    isMobileMenuOpen.value = false;
}

watch(route, () => {
    isMobileMenuOpen.value = false;
});

const checkScreenSize = () => {
    if (window.innerWidth > 992) {
        isMobileMenuOpen.value = false;
    }
};

onMounted(() => {
    window.addEventListener('resize', checkScreenSize);
});

onBeforeUnmount(() => {
    window.removeEventListener('resize', checkScreenSize);
});
</script>

<template>
  <div class="app-wrapper" :class="{ 'admin-bg': isAdminSection }">
    <header class="navbar">
      <div class="container nav-container">
        <!-- LOGO À GAUCHE -->
        <RouterLink to="/" class="nav-logo" @click="closeMenus">Mwinda Hotel</RouterLink>

        <!-- NAVIGATION POUR GRAND ÉCRAN (GROUPÉE À DROITE) -->
        <nav class="desktop-nav">
            <RouterLink to="/" class="nav-link">Accueil</RouterLink>
            <RouterLink to="/chambres" class="nav-link">Chambres</RouterLink>
            <RouterLink to="/a-propos" class="nav-link">À Propos</RouterLink>
            <RouterLink to="/contact" class="nav-link">Contact</RouterLink>
          
            <div class="nav-separator"></div>

            <div v-if="!authStore.isAuthenticated" class="auth-buttons">
              <RouterLink to="/connexion" class="nav-link">Connexion</RouterLink>
              <Button label="Inscription" @click="$router.push('/inscription')" size="small" />
            </div>
            
            <div v-else class="user-menu-container">
              <button class="user-menu-button" @click="isUserMenuOpen = !isUserMenuOpen">
                <i class="pi pi-user p-mr-2"></i><span>{{ authStore.user?.fullName }}</span><i class="pi pi-angle-down p-ml-2"></i>
              </button>
              <Transition name="fade">
                <div v-if="isUserMenuOpen" class="user-dropdown-menu">
                  <RouterLink to="/profil" class="dropdown-item" @click="isUserMenuOpen = false"><i class="pi pi-id-card"></i> Mon Profil</RouterLink>
                  <RouterLink v-if="authStore.isAdmin && !isAdminSection" to="/admin" class="dropdown-item" @click="isUserMenuOpen = false"><i class="pi pi-cog"></i> Administration</RouterLink>
                  <div class="dropdown-divider"></div>
                  <button @click="handleLogout" class="dropdown-item logout"><i class="pi pi-sign-out"></i> Déconnexion</button>
                </div>
              </Transition>
            </div>
        </nav>

        <!-- BOUTON HAMBURGER POUR MOBILE -->
        <button class="mobile-nav-toggle" @click="isMobileMenuOpen = !isMobileMenuOpen" aria-label="Toggle navigation">
          <i :class="isMobileMenuOpen ? 'pi pi-times' : 'pi pi-bars'"></i>
        </button>
      </div>
    </header>
    
    <!-- MENU MOBILE (INCHANGÉ) -->
    <Transition name="slide-right">
      <div v-if="isMobileMenuOpen" class="mobile-nav-overlay" @click="isMobileMenuOpen = false">
        <nav class="mobile-nav" @click.stop>
          <template v-if="isAdminSection">
              <RouterLink to="/admin/dashboard" class="mobile-nav-link"><i class="pi pi-th-large"></i> Tableau de Bord</RouterLink>
              <RouterLink to="/admin/chambres" class="mobile-nav-link"><i class="pi pi-building"></i> Chambres</RouterLink>
              <RouterLink to="/admin/utilisateurs" class="mobile-nav-link"><i class="pi pi-users"></i> Utilisateurs</RouterLink>
              <RouterLink to="/admin/paiements" class="mobile-nav-link"><i class="pi pi-dollar"></i> Paiements</RouterLink>
              <RouterLink to="/admin/factures" class="mobile-nav-link"><i class="pi pi-file-pdf"></i> Factures</RouterLink>
              <div class="mobile-divider"></div>
          </template>
          
          <RouterLink to="/" class="mobile-nav-link"><i class="pi pi-home"></i> Accueil</RouterLink>
          <RouterLink to="/chambres" class="mobile-nav-link"><i class="pi pi-list"></i> Chambres</RouterLink>
          <RouterLink to="/a-propos" class="mobile-nav-link"><i class="pi pi-info-circle"></i> À Propos</RouterLink>
          <RouterLink to="/contact" class="mobile-nav-link"><i class="pi pi-envelope"></i> Contact</RouterLink>
          <div class="mobile-divider"></div>

          <template v-if="!authStore.isAuthenticated">
            <RouterLink to="/connexion" class="mobile-nav-link">Connexion</RouterLink>
            <RouterLink to="/inscription" class="mobile-nav-link">Inscription</RouterLink>
          </template>
          <template v-else>
            <div class="mobile-user-info">Connecté: <strong>{{ authStore.user?.fullName }}</strong></div>
            <RouterLink to="/profil" class="mobile-nav-link"><i class="pi pi-id-card"></i> Mon Profil</RouterLink>
            <RouterLink v-if="authStore.isAdmin && !isAdminSection" to="/admin" class="mobile-nav-link"><i class="pi pi-cog"></i> Administration</RouterLink>
            <button @click="handleLogout" class="mobile-nav-link logout"><i class="pi pi-sign-out"></i> Déconnexion</button>
          </template>
        </nav>
      </div>
    </Transition>
    
    <main><RouterView /></main>
    <footer class="footer"><div class="container">© {{ new Date().getFullYear() }} Mwinda Group. Tous droits réservés.</div></footer>
    <Toast />
  </div>
</template>

<style scoped>
/* Base */
.app-wrapper.admin-bg { background-color: #f1f5f9; }
.navbar { background-color: white; box-shadow: 0 2px 8px rgba(0,0,0,0.1); padding: 0 1rem; position: sticky; top: 0; z-index: 1000; }
.nav-container { display: flex; justify-content: space-between; align-items: center; height: 65px; }
.nav-logo { font-size: 1.6rem; font-weight: 700; text-decoration: none; color: #4f46e5; flex-shrink: 0; }

/* Desktop Navigation - CORRIGÉ */
.desktop-nav { 
    display: flex; 
    align-items: center; 
    gap: 1.5rem;
}
.nav-separator {
    width: 1px;
    height: 24px;
    background-color: #e5e7eb;
    margin: 0 0.5rem;
}
.nav-link { text-decoration: none; color: #334155; font-weight: 500; transition: color 0.3s; padding: 0.5rem; }
.nav-link:hover, .router-link-exact-active { color: #4f46e5; }
.auth-buttons { display: flex; align-items: center; gap: 1rem; }
.user-menu-container { position: relative; }
.user-menu-button { background: transparent; border: none; cursor: pointer; display: flex; align-items: center; font-size: 1rem; font-weight: 500; color: #334155; padding: 0.5rem; border-radius: 6px; transition: background-color 0.2s; }
.user-menu-button:hover { background-color: #f1f5f9; }
.user-dropdown-menu { position: absolute; top: 120%; right: 0; background: white; border-radius: 8px; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); width: 200px; padding: 0.5rem; z-index: 1100; }
.dropdown-item { display: flex; align-items: center; gap: 0.75rem; width: 100%; padding: 0.75rem 1rem; text-decoration: none; color: #334155; font-size: 0.95rem; border: none; background: none; text-align: left; cursor: pointer; border-radius: 6px; }
.dropdown-item:hover { background-color: #f1f5f9; color: #4f46e5; }
.dropdown-item.logout { color: #ef4444; }
.dropdown-divider { height: 1px; background-color: #e5e7eb; margin: 0.5rem 0; }

/* Mobile Navigation - Styles inchangés */
.mobile-nav-toggle { display: none; background: none; border: none; cursor: pointer; font-size: 1.5rem; color: #334155; }
.mobile-nav-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.5); z-index: 1200; }
.mobile-nav { position: fixed; top: 0; right: 0; width: 280px; height: 100%; background-color: white; box-shadow: -10px 0 15px -3px rgba(0,0,0,0.1); padding: 2rem 1rem; display: flex; flex-direction: column; gap: 0.5rem; }
.mobile-nav-link { text-decoration: none; color: #334155; font-size: 1.1rem; padding: 0.75rem 1rem; border-radius: 6px; display: flex; align-items: center; gap: 0.75rem; border: none; width: 100%; background: none; text-align: left; }
.mobile-nav-link:hover { background-color: #f1f5f9; }
.mobile-nav-link.logout { color: #ef4444; }
.mobile-divider { height: 1px; background: #e5e7eb; margin: 1rem 0; }
.mobile-user-info { padding: 0.75rem 1rem; color: #64748b; font-size: 0.9rem; }

/* Transitions */
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease, transform 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; transform: translateY(-10px); }
.slide-right-enter-active, .slide-right-leave-active { transition: all 0.3s ease-out; }
.slide-right-enter-from, .slide-right-leave-to { opacity: 0; }
.slide-right-enter-from .mobile-nav, .slide-right-leave-to .mobile-nav { transform: translateX(100%); }

/* Footer */
.footer { text-align: center; padding: 1.5rem; background-color: #eef2ff; color: #4f46e5; border-top: 1px solid #e0e7ff; }

/* Media Query */
@media (max-width: 992px) {
  .desktop-nav { display: none; }
  .mobile-nav-toggle { display: block; }
}

.p-mr-2 { margin-right: 0.5rem; }
.p-ml-2 { margin-left: 0.5rem; }
</style>