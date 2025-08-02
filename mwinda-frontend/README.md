# Projet de Test d'Intégration - Mwinda Group
## Candidat : Michel Nyembo

## Application Web de Réservation et Facturation Hôtelière

Ce projet est une application web complète développée dans le cadre du test technique pour le poste d'Ingénieur Développeur Web & Réseau.

---

### Technologies Utilisées

*   **Backend:**
    *   **Framework:** Node.js avec Express.js
    *   **Base de Données:** MySQL
    *   **ORM:** Sequelize
    *   **Authentification:** JSON Web Tokens (JWT)
    *   **Autres:** Nodemailer (emails), PDFKit (factures PDF)

*   **Frontend:**
    *   **Framework:** Vue.js 3 (Composition API)
    *   **Outil de Build:** Vite
    *   **Gestion d'état:** Pinia
    *   **Routing:** Vue Router
    *   **Bibliothèque de Composants UI:** PrimeVue
    *   **Appels API:** Axios

*   **Déploiement:**
    *   Docker & Docker Compose

---

### Fonctionnalités Implémentées

#### Interface Utilisateur (Frontend)
- [x] Page d’accueil avec vitrine de l'hôtel et témoignages clients.
- [x] Liste des chambres avec filtres (type, prix) et pagination.
- [x] Page de détails des chambres avec galerie d'images.
- [x] Formulaire de réservation avec sélection de dates.
- [x] Tableau de bord client avec historique des réservations et téléchargement des factures.
- [x] Interface d'administration pour la gestion complète des chambres (CRUD).

#### Fonctionnalités du Backend
- [x] Authentification sécurisée des utilisateurs (Clients + Admin) avec JWT.
- [x] CRUD complet pour les chambres et les réservations.
- [x] Génération automatique des factures au format PDF après paiement.
- [x] Notifications de confirmation de réservation par email (avec Nodemailer).
- [x] Réinitialisation de mot de passe par email.
- [x] API RESTful complète et documentée (voir ci-dessous).

#### Base de Données
- [x] Utilisation de MySQL.
- [x] Schéma clair avec relations entre les tables (Users, Rooms, Bookings, Payments, Invoices).

#### Consommabilité et Déploiement
- [x] Application entièrement "dockerisée" (backend + base de données) pour un déploiement facile.
- [x] Interface responsive (mobile friendly) grâce à PrimeVue.

#### Bonus Implémentés
- [x] **Intégration d'un système de paiement simulé** (Airtel Money, M-Pesa).
- [x] **Tableau de bord statistique pour l'admin** affichant les revenus, le taux d'occupation, etc.

---

### Comment Lancer le Projet

**Prérequis:**
*   Node.js (v18+)
*   Docker et Docker Compose

**Instructions:**

1.  **Cloner le projet :**
    ```bash
    git clone <votre-url-de-repo>
    cd mwinda-group-test
    ```

2.  **Configurer le Backend :**
    *   Naviguez vers le dossier `mwinda-hotel-backend`.
    *   Créez un fichier `.env` en vous basant sur le fichier `.env.example` (ou incluez votre `.env` directement).
    *   Remplissez les informations de la base de données et du serveur mail.

3.  **Lancer avec Docker (Méthode recommandée) :**
    *   À la racine du dossier `mwinda-hotel-backend`, exécutez :
    ```bash
    docker-compose up --build
    ```
    *   Le backend sera disponible sur `http://localhost:8080`.

4.  **Lancer le Frontend :**
    *   Ouvrez un nouveau terminal et naviguez vers `mwinda-frontend`.
    *   Installez les dépendances :
    ```bash
    npm install
    ```
    *   Lancez le serveur de développement :
    ```bash
    npm run dev
    ```
    *   L'application sera accessible sur `http://localhost:5173` (ou le port indiqué).

---

### Conclusion

Ce projet a été une excellente opportunité de démontrer mes compétences full-stack. J'ai pris plaisir à concevoir et à développer cette solution de bout en bout, en me concentrant sur la qualité du code, la robustesse de l'architecture et l'expérience utilisateur.

**Michel Nyembo**