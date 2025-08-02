<!-- src/views/admin/AdminInvoicesView.vue -->
<script setup>
import { ref, onMounted } from 'vue';
import api from '@/services/api';
import { useToast } from 'primevue/usetoast';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';

const toast = useToast();
const invoices = ref([]);
const loading = ref(true);
const deleteDialog = ref(false);
const invoice = ref({});
const totalRecords = ref(0);
const lazyParams = ref({ page: 1 });

const loadInvoices = async (event) => {
    loading.value = true;
    const page = event ? event.page + 1 : lazyParams.value.page;
    try {
        const response = await api.get('/admin/invoices', {
            params: { page: page, size: 5 }
        });
        invoices.value = response.data.data;
        totalRecords.value = response.data.totalItems;
    } catch(e) { console.error(e) } 
    finally { loading.value = false; }
};

onMounted(() => {
    lazyParams.value.page = 1;
    loadInvoices();
});

const onPage = (event) => {
    loadInvoices(event);
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
     toast.add({ severity: 'error', summary: 'Erreur', detail: 'Impossible de télécharger.', life: 3000 });
  }
};

const confirmDeleteInvoice = (prod) => {
    invoice.value = prod;
    deleteDialog.value = true;
};

const deleteInvoice = async () => {
    try {
        await api.delete(`/admin/invoices/${invoice.value.id}`);
        toast.add({ severity: 'success', summary: 'Succès', detail: 'Facture supprimée', life: 3000 });
        deleteDialog.value = false;
        loadInvoices();
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Erreur', detail: 'Suppression échouée', life: 3000 });
    }
};

const formatDate = (value) => new Date(value).toLocaleDateString('fr-FR');
</script>

<template>
  <div>
    <h1 class="section-title">Gestion des Factures</h1>
    <div class="card">
      <DataTable
        :value="invoices"
        :loading="loading"
        :lazy="true"
        :paginator="true"
        :rows="5"
        :totalRecords="totalRecords"
        @page="onPage"
        responsiveLayout="scroll"
      >
        <!-- Les colonnes <Column> restent les mêmes -->
        <Column field="invoiceNumber" header="N° Facture"></Column>
      <Column field="booking.user.fullName" header="Client"></Column>
      <Column field="issueDate" header="Date d'émission"><template #body="slotProps">{{ formatDate(slotProps.data.issueDate) }}</template></Column>
      <Column header="Actions">
        <template #body="slotProps">
          <Button icon="pi pi-download" class="p-button-rounded p-button-info p-mr-2" @click="downloadInvoice(slotProps.data.bookingId)" />
          <Button icon="pi pi-trash" class="p-button-rounded p-button-danger" @click="confirmDeleteInvoice(slotProps.data)" />
        </template>
      </Column>
      </DataTable>
    </div>

    <Dialog v-model:visible="deleteDialog" :style="{width: '450px'}" header="Confirmation" :modal="true">
        <div><i class="pi pi-exclamation-triangle p-mr-3" style="font-size: 2rem" /><span>Êtes-vous sûr de vouloir supprimer la facture <b>{{invoice.invoiceNumber}}</b> ?</span></div>
        <template #footer><Button label="Non" icon="pi pi-times" text @click="deleteDialog=false"/><Button label="Oui" icon="pi pi-check" @click="deleteInvoice" /></template>
    </Dialog>
  </div>
</template>