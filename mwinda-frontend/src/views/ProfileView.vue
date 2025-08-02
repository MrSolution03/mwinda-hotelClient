<script setup>
import { ref, onMounted, computed, watch } from 'vue'; // Ajout de watch
import { useAuthStore } from '@/stores/auth';
import { useToast } from 'primevue/usetoast';
import api from '@/services/api';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import Tag from 'primevue/tag';
import Dialog from 'primevue/dialog';
import Dropdown from 'primevue/dropdown';
import Card from 'primevue/card';
import InputText from 'primevue/inputtext';
import Tooltip from 'primevue/tooltip';
import Image from 'primevue/image';
// InputOtp n'est plus nécessaire

const vTooltip = Tooltip;
const authStore = useAuthStore();
const toast = useToast();
const bookings = ref([]);
const loadingBookings = ref(true);
const profileData = ref({});
const profileLoading = ref(false);

// --- LOGIQUE DE PAIEMENT MODIFIÉE ---
const paymentDialog = ref(false);
const selectedBooking = ref(null);
const paymentMethod = ref(null);
const paymentLoading = ref(false);
const paymentMethods = ref(['Airtel Money', 'M-Pesa']);
const userPhoneNumber = ref('');
const enteredPin = ref(''); // Nouvelle variable pour le code PIN
const showPinInput = ref(false); // Nouvelle variable pour contrôler l'affichage du champ PIN

const paymentMethodLogo = computed(() => {
  if (paymentMethod.value === 'Airtel Money') return '/images/airtel-money.png';
  if (paymentMethod.value === 'M-Pesa') return '/images/mpesa.png';
  return null;
});

// --- LOGIQUE DE VALIDATION DE PRÉFIXE (inchangée) ---
const isPaymentNumberInvalid = computed(() => {
    if (!paymentMethod.value || !userPhoneNumber.value) return false;
    const num = userPhoneNumber.value.replace(/\s/g, '');
    if (paymentMethod.value === 'Airtel Money') {
        return !(num.startsWith('099') || num.startsWith('097'));
    }
    if (paymentMethod.value === 'M-Pesa') {
        return !(num.startsWith('081') || num.startsWith('082') || num.startsWith('086'));
    }
    return true;
});

// Affiche le champ PIN quand le numéro est valide
watch(userPhoneNumber, (newValue) => {
    const num = newValue.replace(/\s/g, '');
    if (!isPaymentNumberInvalid.value && num.length >= 9) {
        showPinInput.value = true;
    } else {
        showPinInput.value = false;
    }
});

const paymentNumberErrorMessage = computed(() => {
    if (!isPaymentNumberInvalid.value) return null;
    if (paymentMethod.value === 'Airtel Money') return "Pour Airtel, le numéro doit commencer par 099 ou 097.";
    if (paymentMethod.value === 'M-Pesa') return "Pour M-Pesa, le numéro doit commencer par 081, 082 ou 086.";
    return null;
});
// --- FIN DE LA VALIDATION ---

const loadBookings = async () => {
    if (authStore.isAdmin) {
        loadingBookings.value = false;
        return;
    }
    loadingBookings.value = true;
    try {
        const response = await api.get('/user/bookings');
        bookings.value = response.data;
    } catch (error) { 
        console.error("Erreur de chargement des réservations:", error);
        toast.add({ severity: 'error', summary: 'Erreur', detail: 'Impossible de charger vos réservations.', life: 3000 });
    } 
    finally { loadingBookings.value = false; }
};

const handleUpdateProfile = async () => {
    profileLoading.value = true;
    try {
        await authStore.updateUserProfile({
            fullName: profileData.value.fullName,
            phoneNumber: profileData.value.phoneNumber,
            address: profileData.value.address
        });
        toast.add({ severity: 'success', summary: 'Succès', detail: 'Profil mis à jour.', life: 3000 });
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Erreur', detail: 'La mise à jour a échoué.', life: 3000 });
    } finally {
        profileLoading.value = false;
    }
};

onMounted(() => {
    loadBookings();
    profileData.value = {
        fullName: authStore.user?.fullName || '',
        email: authStore.user?.email || '',
        phoneNumber: authStore.user?.phoneNumber || '',
        address: authStore.user?.address || ''
    }
});

const openPaymentDialog = (booking) => {
  selectedBooking.value = booking;
  paymentDialog.value = true;
};


// --- NOUVELLE FONCTION DE PAIEMENT ---
const handlePayment = async () => {
  paymentLoading.value = true;

  // Simulation de la vérification du code PIN
  if (enteredPin.value !== '1234') {
    toast.add({ severity: 'error', summary: 'Erreur', detail: 'Le code PIN est incorrect.', life: 3000 });
    paymentLoading.value = false;
    return;
  }
  
  // Si le PIN est correct, on procède au paiement
  try {
    // On simule une petite attente pour le réalisme
    await new Promise(resolve => setTimeout(resolve, 1500));

    await api.post('/bookings/pay', { bookingId: selectedBooking.value.id, method: paymentMethod.value });
    toast.add({ severity: 'success', summary: 'Paiement Réussi', detail: 'Votre réservation est confirmée !', life: 4000 });
    paymentDialog.value = false;
    loadBookings();
  } catch(error) {
    toast.add({ severity: 'error', summary: 'Erreur', detail: error.response?.data?.message || 'Le paiement a échoué.', life: 4000 });
  } finally {
    paymentLoading.value = false;
  }
};


const resetPaymentDialog = () => {
    paymentMethod.value = null;
    userPhoneNumber.value = '';
    enteredPin.value = '';
    showPinInput.value = false;
};

const downloadInvoice = async (bookingId) => {
  try {
    const response = await api.get(`/bookings/${bookingId}/invoice`, { responseType: 'blob' });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `facture-mwinda-${bookingId}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch(error) {
     toast.add({ severity: 'error', summary: 'Erreur', detail: 'Impossible de télécharger la facture.', life: 3000 });
  }
};

const formatDate = (value) => value ? new Date(value).toLocaleDateString('fr-FR') : '';
const getStatusSeverity = (status) => {
    if (status === 'confirmée') return 'success';
    if (status === 'en attente') return 'warning';
    return 'danger';
};
</script>

<template>
  <div class="container" :class="authStore.isAdmin ? 'admin-profile' : 'client-profile'">
    <div class="profile-info">
      <Card>
        <template #title>Mes Informations</template>
        <template #content>
            <form @submit.prevent="handleUpdateProfile" class="p-fluid">
                <div class="p-field"><label for="fullName">Nom complet</label><InputText id="fullName" v-model="profileData.fullName" /></div>
                <div class="p-field"><label for="email">Email (non modifiable)</label><InputText id="email" v-model="profileData.email" disabled /></div>
                <div class="p-field"><label for="phone">Téléphone</label><InputText id="phone" v-model="profileData.phoneNumber" placeholder="Ex: 0812345678" /></div>
                <div class="p-field"><label for="address">Adresse</label><InputText id="address" v-model="profileData.address" /></div>
                <Button type="submit" label="Mettre à jour" :loading="profileLoading" />
            </form>
        </template>
      </Card>
    </div>
    
    <div v-if="!authStore.isAdmin" class="profile-bookings">
      <DataTable :value="bookings" :loading="loadingBookings" responsiveLayout="scroll">
          <template #header>Historique de vos réservations</template>
          <template #empty>Vous n'avez aucune réservation pour le moment.</template>
          <Column field="room.type" header="Chambre" />
          <Column field="arrivalDate" header="Arrivée"><template #body="slotProps">{{ formatDate(slotProps.data.arrivalDate) }}</template></Column>
          <Column field="status" header="Statut">
              <template #body="slotProps"><Tag :value="slotProps.data.status" :severity="getStatusSeverity(slotProps.data.status)" /></template>
          </Column>
          <Column header="Actions" style="width: 8rem; text-align: center;">
              <template #body="slotProps">
                  <Button v-if="slotProps.data.status === 'en attente'" icon="pi pi-dollar" class="p-button-rounded p-button-success" @click="openPaymentDialog(slotProps.data)" v-tooltip.top="'Payer'" />
                  <Button v-if="slotProps.data.status === 'confirmée'" icon="pi pi-download" class="p-button-rounded" @click="downloadInvoice(slotProps.data.id)" v-tooltip.top="'Télécharger la facture'" />
              </template>
          </Column>
      </DataTable>
    </div>

    <!-- DIALOGUE DE PAIEMENT MODIFIÉ -->
    <Dialog v-if="!authStore.isAdmin" v-model:visible="paymentDialog" modal header="Finaliser le Paiement" :style="{ width: '30rem' }" @hide="resetPaymentDialog">
      <div>
          <p>Vous êtes sur le point de payer <strong>{{ selectedBooking?.totalPrice }} USD</strong>.</p>
          <Dropdown v-model="paymentMethod" :options="paymentMethods" placeholder="Choisissez une méthode de paiement" class="p-mt-2" style="width:100%" />
          
          <div v-if="paymentMethod" class="payment-details">
            <Image :src="paymentMethodLogo" alt="Logo de paiement" width="100" />
            <p class="p-mt-3">Veuillez entrer le numéro de téléphone pour ce paiement.</p>
            <div class="p-fluid">
                <InputText v-model="userPhoneNumber" placeholder="Ex: 0812345678" :class="{ 'p-invalid': isPaymentNumberInvalid }" />
                <small v-if="isPaymentNumberInvalid" class="p-error">{{ paymentNumberErrorMessage }}</small>
            </div>

            <!-- Le champ PIN qui apparait quand le numéro est valide -->
            <div v-if="showPinInput" class="p-fluid p-mt-3">
                <label for="pin">Veuillez entrer votre code PIN {{ paymentMethod }}</label>
                <InputText id="pin" v-model="enteredPin" type="password" placeholder="Le code pour ce test est 1234" maxlength="4" />
            </div>
          </div>
      </div>
      
      <template #footer>
          <Button label="Annuler" icon="pi pi-times" text @click="paymentDialog = false" />
          <Button 
            label="Payer" 
            icon="pi pi-check" 
            @click="handlePayment" 
            :loading="paymentLoading" 
            :disabled="!showPinInput || !enteredPin || enteredPin.length < 4" 
          />
      </template>
    </Dialog>
  </div>
</template>

<style scoped>
.container.client-profile { display: grid; grid-template-columns: 1fr 2fr; gap: 2rem; margin-top: 2rem; }
.container.admin-profile { max-width: 700px; margin-top: 2rem; margin-left: auto; margin-right: auto; }
.p-field { margin-bottom: 1.5rem; }
@media (max-width: 992px) { .container.client-profile { grid-template-columns: 1fr; } }
.payment-details { margin-top: 1.5rem; padding-top: 1.5rem; border-top: 1px solid #dee2e6; text-align: center; }
.payment-details p { margin: 0.5rem 0; }
.payment-details label { margin-bottom: 0.5rem; display: block; }
.p-mt-3 { margin-top: 1.5rem; }
.p-error { color: #ef4444; font-size: 0.9rem; text-align: left; display: block; margin-top: 0.25rem; }
</style>