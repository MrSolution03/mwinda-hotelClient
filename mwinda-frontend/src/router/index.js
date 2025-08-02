import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

import HomeView from '../views/HomeView.vue'
import RoomsView from '../views/RoomsView.vue'
import RoomDetailView from '../views/RoomDetailView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import ProfileView from '../views/ProfileView.vue'
import AdminDashboardView from '../views/admin/AdminDashboardView.vue'
import AdminRoomsView from '../views/admin/AdminRoomsView.vue'
import NotFoundView from '../views/NotFoundView.vue'
import ForgotPasswordView from '@/views/ForgotPasswordView.vue'
import ResetPasswordView from '@/views/ResetPasswordView.vue'
import AdminLayout from '@/views/admin/AdminLayout.vue'; 
import AdminUsersView from '@/views/admin/AdminUsersView.vue';
import AdminPaymentsView from '@/views/admin/AdminPaymentsView.vue';
import AdminInvoicesView from '@/views/admin/AdminInvoicesView.vue';
import AboutView from '@/views/AboutView.vue';
import ContactView from '@/views/ContactView.vue'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // --- ROUTES PUBLIQUES ET CLIENTS ---
    { path: '/', name: 'home', component: HomeView },
    { path: '/chambres', name: 'rooms', component: RoomsView },
    { path: '/chambres/:id', name: 'room-detail', component: RoomDetailView, props: true },
    { path: '/connexion', name: 'login', component: LoginView },
    { path: '/inscription', name: 'register', component: RegisterView },
    { path: '/mot-de-passe-oublie', name: 'forgot-password', component: ForgotPasswordView },
    { path: '/reset-password/:token', name: 'reset-password', component: ResetPasswordView },
    { path: '/', name: 'home', component: HomeView },
    { path: '/a-propos', name: 'about', component: AboutView },
    { path: '/contact', name: 'contact', component: ContactView }, 
    {
      path: '/profil',
      name: 'profile',
      component: ProfileView,
      meta: { requiresAuth: true }
    },
    
    // --- ROUTES DE L'ADMINISTRATION (LA PARTIE IMPORTANTE) ---
    {
      path: '/admin',
      component: AdminLayout, // 1. On charge d'abord la coquille (le layout)
      meta: { requiresAuth: true, requiresAdmin: true },
      children: [ // 2. Ensuite, on injecte l'un de ces enfants à l'intérieur
        { path: '', redirect: '/admin/dashboard' }, // Redirige /admin vers /admin/dashboard
        { path: 'dashboard', name: 'admin-dashboard', component: AdminDashboardView },
        { path: 'chambres', name: 'admin-rooms', component: AdminRoomsView },
        { path: 'utilisateurs', name: 'admin-users', component: AdminUsersView },
        { path: 'paiements', name: 'admin-payments', component: AdminPaymentsView },
        { path: 'factures', name: 'admin-invoices', component: AdminInvoicesView },
      ]
    },

    // --- Page 404 ---
    { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFoundView }
  ]
})

// La garde de navigation reste la même
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'login' });
  } else if (to.meta.requiresAdmin && !authStore.isAdmin) {
    next({ name: 'home' });
  } else {
    next();
  }
})

export default router