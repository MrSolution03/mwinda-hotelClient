// src/services/roomService.js
import api from './api';

class RoomService {
  // Récupère une liste paginée et filtrée de chambres
  getRooms(params) {
    // params sera un objet comme { page: 1, size: 8, type: 'Suite', ... }
    return api.get('/rooms', { params });
  }

  // Récupère la liste unique des types de chambres
  getRoomTypes() {
    return api.get('/rooms/types');
  }

  // Récupère les détails d'une seule chambre par son ID
  getRoomById(id) {
    return api.get(`/rooms/${id}`);
  }
}

export default new RoomService();