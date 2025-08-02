<!-- src/views/admin/AdminPaymentsView.vue -->
<script setup>
import { ref, onMounted } from 'vue';
import api from '@/services/api';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Tag from 'primevue/tag';

const payments = ref([]);
const loading = ref(true);
const totalRecords = ref(0);
const lazyParams = ref({ page: 1 });

const loadPayments = async (event) => {
    loading.value = true;
    const page = event ? event.page + 1 : lazyParams.value.page;
    try {
        const response = await api.get('/admin/payments', {
            params: { page: page, size: 5 }
        });
        payments.value = response.data.data;
        totalRecords.value = response.data.totalItems;
    } catch(e) { console.error(e) } 
    finally { loading.value = false; }
};

onMounted(() => {
    lazyParams.value.page = 1;
    loadPayments();
});

const onPage = (event) => {
    loadPayments(event);
};

const formatDate = (value) => new Date(value).toLocaleDateString('fr-FR');
const getStatusSeverity = (status) => status === 'réussi' ? 'success' : 'danger';
</script>
<template>
  <div>
    <h1 class="section-title">Historique des Paiements</h1>
    <div class="card">
      <DataTable 
        :value="payments" 
        :loading="loading"
        :lazy="true"
        :paginator="true"
        :rows="5"
        :totalRecords="totalRecords"
        @page="onPage"
        responsiveLayout="scroll"
      >
        <!-- Les colonnes <Column> restent les mêmes -->
         <Column field="id" header="ID Paiement"></Column>
      <Column field="booking.user.fullName" header="Client"></Column>
      <Column field="amount" header="Montant"><template #body="slotProps">{{ slotProps.data.amount }} USD</template></Column>
      <Column field="method" header="Méthode"></Column>
      <Column field="status" header="Statut">
        <template #body="slotProps"><Tag :value="slotProps.data.status" :severity="getStatusSeverity(slotProps.data.status)" /></template>
      </Column>
      <Column field="paymentDate" header="Date"><template #body="slotProps">{{ formatDate(slotProps.data.paymentDate) }}</template></Column>
      </DataTable>
    </div>
  </div>
</template>