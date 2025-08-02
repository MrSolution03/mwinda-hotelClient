<script setup>
import Card from 'primevue/card';
</script>

<template>
  <div class="contact-view-wrapper">
    <div class="container">
      <div class="contact-content">
        <div class="info-side">
          <h1 class="title">Entrez en contact</h1>
          <p class="subtitle">
            Que ce soit pour une réservation, une question ou un partenariat,
            notre équipe est à votre disposition.
          </p>

          <ul class="contact-list">
            <li class="contact-item">
              <i class="pi pi-map-marker icon"></i>
              <div class="contact-info">
                <strong>Adresse</strong>
                <span>123 Avenue Lumumba, Kolwezi, Lualaba, RDC</span>
              </div>
            </li>
            <li class="contact-item">
              <i class="pi pi-whatsapp icon whatsapp-icon"></i>
              <div class="contact-info">
                <strong>WhatsApp</strong>
                <a href="https://wa.me/243XXXXXXXXX" target="_blank" rel="noopener noreferrer">+243 XXX XXX XXX</a>
              </div>
            </li>
            <li class="contact-item">
              <i class="pi pi-envelope icon"></i>
              <div class="contact-info">
                <strong>Email</strong>
                <a href="mailto:contact@mwindahotel.com">contact@mwindahotel.com</a>
              </div>
            </li>
            <li class="contact-item">
              <i class="pi pi-phone icon"></i>
              <div class="contact-info">
                <strong>Téléphone</strong>
                <a href="tel:+243XXXXXXXXX">+243 XXX XXX XXX</a>
              </div>
            </li>
          </ul>
        </div>

        <div class="image-side">
          <img src="https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop" alt="Hôtel Façade" class="contact-image"/>
        </div>
      </div>
    </div>
  </div>

  <div class="developer-credit">
    Développé par Onpoint | MrSolution
  </div>
</template>

<style scoped>
.contact-view-wrapper {
  padding: 5rem 0;
  background-color: #fff;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.contact-content {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  align-items: center;
  gap: 3rem;
  background-color: #f8f9fa;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04);
}

.info-side {
  padding: 3rem;
}

.title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 1rem;
}

.subtitle {
  color: #64748b;
  font-size: 1.1rem;
  margin-bottom: 3rem;
  line-height: 1.6;
}

.contact-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.contact-item:last-child {
  margin-bottom: 0;
}

.contact-item .icon {
  font-size: 1.8rem;
  color: #4f46e5;
}

.contact-item .whatsapp-icon {
  color: #25D366;
}

.contact-info {
  display: flex;
  flex-direction: column;
}

.contact-info strong {
  font-weight: 600;
  color: #334155;
  margin-bottom: 0.25rem;
}

.contact-info span, .contact-info a {
  color: #64748b;
  text-decoration: none;
  font-size: 1rem;
}

.contact-info a:hover {
  text-decoration: underline;
  color: #4f46e5;
}

.image-side {
  height: 100%;
}

.contact-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.developer-credit {
  text-align: center;
  padding: 1.5rem;
  background-color: #1e293b;
  color: #cbd5e1;
  font-size: 0.9rem;
  font-weight: 500;
}

@media (max-width: 992px) {
  .contact-content {
    grid-template-columns: 1fr;
  }
  .image-side {
    order: -1; /* Mettre l'image en premier sur mobile */
    height: 300px;
  }
  .info-side {
    padding: 2rem;
  }
}
</style>