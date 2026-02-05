import axios from 'axios';

const API_URL = 'http://localhost:7000/api/feedback';

export const feedbackService = {
    crea: async (data: {
        id_prenotazione: number;
        nome: string;
        email: string;
        titolo: string;
        testo: string;
        punteggio: number;
    }) => {
        const response = await axios.post(API_URL, data);
        return response.data;
    },

    getByAbitazione: async (idAbitazione: number | string) => {
        const response = await axios.get(`${API_URL}/abitazione/${idAbitazione}`);
        return response.data;
    },

    getMedia: async (idAbitazione: number | string) => {
        const response = await axios.get(`${API_URL}/media/${idAbitazione}`);
        return response.data;
    },

    delete: async (id: number) => {
        const response = await axios.delete(`${API_URL}/${id}`);
        return response.data;
    }
};


