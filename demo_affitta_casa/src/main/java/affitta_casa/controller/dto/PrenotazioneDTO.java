package affitta_casa.controller.dto;

import java.time.LocalDate;

import affitta_casa.models.Abitazione;

public class PrenotazioneDTO {
    // Dati per la prenotazione
    public Abitazione id_abitazione;
    public LocalDate data_inizio;
    public LocalDate data_fine;

    // Dati per identificare l'utente (che non sono nella tabella prenotazione)
    public String guest_nome;
    public String guest_cognome;
    public String guest_email;

    // Costruttore vuoto necessario per Javalin/Jackson
    public PrenotazioneDTO() {}
}
