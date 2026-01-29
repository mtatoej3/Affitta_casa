export interface Utente {
    id?: number;
    nome: string;
    cognome: string;
    email: string;
    indirizzo: string;
    codice_host: string;
    ruolo: 'GUEST' | 'HOST' | 'SUPER_HOST';
}