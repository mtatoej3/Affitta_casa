import axios from 'axios';

export const prenotazioneService = {
    invia: async (prenotazione: any) => {
        const response = await axios.post('http://localhost:7000/api/prenotazioni', prenotazione);
        return response.data;
    }
};