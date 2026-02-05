import axios from 'axios';

// Usiamo "Abitazione" per riflettere esattamente il modello DB/Java
export interface Abitazione {
    id: number;
    nome: string;
    indirizzo: string;
    n_locali: number;
    n_posti_letto: number;
    piano: number;
    id_host: any;
    dataInizio?: string;
    dataFine?: string;
    disponibilita?: any[];
}

const API_URL = 'http://localhost:7000/api/abitazioni';

export const abitazioneService = {
    getAll: async () => {
        // Chiamata GET al backend Javalin
        const response = await axios.get<Abitazione[]>(API_URL);
        return response.data;
    },

    cerca: async (nome?: string, indirizzo?: string, nLocali?: number, nPosti?: number, dataInizio?: string, dataFine?: string) => {
        const response = await axios.get<Abitazione[]>(`${API_URL}/cerca`, {
            params: {
                nome: nome || undefined,
                indirizzo: indirizzo || undefined,
                nLocali: nLocali && nLocali > 0 ? nLocali : undefined,
                nPosti: nPosti && nPosti > 0 ? nPosti : undefined,
                dataInizio: dataInizio || undefined,
                dataFine: dataFine || undefined
            }
        });
        return response.data;
    },


    salva: async (nuovaAbitazione: Partial<Abitazione>) => {
        const response = await axios.post<Abitazione>(API_URL, nuovaAbitazione);
        return response.data;
    },

    getById: async (id: string | number) => {
        // Verifica che l'URL sia corretto (es. http://localhost:7000/api/abitazioni/1)
        const response = await axios.get(`${API_URL}/${id}`);
        return response.data;

    },
};