import axios from 'axios';

const API_URL = 'http://localhost:7000/api/disponibilita';

export const disponibilitaService = {
    // Recupera la lista per la tabella
    getByAbitazione: async (idAbitazione: number | string) => {
        const response = await axios.get(`${API_URL}/${idAbitazione}`);
        return response.data;
    },

    delete: async (id: number) => {
        const response = await axios.delete(`${API_URL}/${id}`);
        return response.data;
    }
};