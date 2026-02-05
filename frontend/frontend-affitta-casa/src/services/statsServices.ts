import type { Abitazione } from './abitazioneService';



export const statsService = {
    getAbitazioniByHost: async (codiceHost: string): Promise<Abitazione[]> => {
        const response = await fetch(`http://localhost:7000/api/stats/abitazioni-host?codiceHost=${codiceHost}`);
        if (!response.ok) throw new Error("Errore nel recupero abitazioni host");
        return response.json();
    },

    getUltimaPrenotazione: async (idUtente: number): Promise<any> => {
        const response = await fetch(`http://localhost:7000/api/stats/ultima-prenotazione/${idUtente}`);
        if (response.status === 404) return null;
        if (!response.ok) throw new Error("Errore nel recupero dell'ultima prenotazione");
        return response.json();
    },

    getTopMese: async (): Promise<any> => {
        const response = await fetch('http://localhost:7000/api/stats/top-mese');
        if (response.status === 404) return null;
        if (!response.ok) throw new Error("Errore nel recupero dell'abitazione più gettonata del mese");
        return response.json();
    },

    getTopHosts: async (): Promise<any[]> => {
        const response = await fetch('http://localhost:7000/api/stats/top-hosts');
        if (!response.ok) throw new Error("Errore nel recupero dei top host");
        return response.json(); // Restituirà un array []
    },

    getSuperHosts: async (): Promise<any[]> => {
        const response = await fetch('http://localhost:7000/api/stats/super-hosts');
        if (!response.ok) throw new Error("Errore nel recupero dei super-host");
        return response.json();
    },

    getTopGuestsGiorni: async (): Promise<any[]> => {
        const response = await fetch('http://localhost:7000/api/stats/top-guests-giorni');
        if (!response.ok) throw new Error("Errore nel recupero dei top guest");
        return response.json();
    },

    getMediaPostiLetto: async (): Promise<any> => {
        const response = await fetch('http://localhost:7000/api/stats/media-posti-letto');
        if (!response.ok) throw new Error("Errore nel recupero della media posti letto");
        return response.json();
    }
};


