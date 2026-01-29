import axios from 'axios';
import type { Utente } from '../types';

// L'URL base del tuo server Javalin
const API_URL = 'http://localhost:7000/api/utenti';

export const utenteService = {
    // Corrisponde a registra(Context ctx) in Java
    create: async (utente: Utente) => {
        const response = await axios.post<Utente>(API_URL, utente);
        return response.data;
    },

    // Corrisponde a getProfilo(Context ctx) in Java
    getById: async (id: number) => {
        const response = await axios.get<Utente>(`${API_URL}/${id}`);
        return response.data;
    }
};

