import axios from 'axios';

export const prenotazioneService = {
    invia: async (prenotazione: any) => {
        const response = await axios.post('http://localhost:7000/api/prenotazioni', prenotazione);
        return response.data;
    },

    getByAbitazione: async (idAbitazione: number | string) => {
        const response = await axios.get(`http://localhost:7000/api/prenotazioni/abitazione/${idAbitazione}`);
        return response.data;
    },
    aggiornaStato: async (idPrenotazione: number, nuovoStato: 'confermata' | 'cancellata') => {
        const response = await axios.put(`http://localhost:7000/api/prenotazioni/${idPrenotazione}/stato?stato=${nuovoStato}`);
        return response.data;
    },

    search: async (query: string) => {
        const response = await axios.get(`http://localhost:7000/api/prenotazioni/cerca?q=${encodeURIComponent(query)}`);
        return response.data;
    }
};