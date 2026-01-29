package affitta_casa.models;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class Prenotazione {
    
    private int id;
    private int id_abitazione;
    private int id_guest;
    private LocalDate data_inizio;
    private LocalDate data_fine;
    private LocalDateTime data_creazione;
    private stato stato;



    public enum stato {

        confermata,
        cancellata,
        in_attesa,
    }



    public Prenotazione(int id_abitazione, int id_guest, LocalDate data_inizio, LocalDate data_fine,
            LocalDateTime data_creazione, affitta_casa.models.Prenotazione.stato stato) {
        this.id_abitazione = id_abitazione;
        this.id_guest = id_guest;
        this.data_inizio = data_inizio;
        this.data_fine = data_fine;
        this.data_creazione = data_creazione;
        this.stato = stato;
    }



    public int getId() {
        return id;
    }



    public int getId_abitazione() {
        return id_abitazione;
    }



    public void setId_abitazione(int id_abitazione) {
        this.id_abitazione = id_abitazione;
    }



    public int getId_guest() {
        return id_guest;
    }



    public void setId_guest(int id_guest) {
        this.id_guest = id_guest;
    }



    public LocalDate getData_inizio() {
        return data_inizio;
    }



    public void setData_inizio(LocalDate data_inizio) {
        this.data_inizio = data_inizio;
    }



    public LocalDate getData_fine() {
        return data_fine;
    }



    public void setData_fine(LocalDate data_fine) {
        this.data_fine = data_fine;
    }



    public LocalDateTime getData_creazione() {
        return data_creazione;
    }



    public void setData_creazione(LocalDateTime data_creazione) {
        this.data_creazione = data_creazione;
    }



    public stato getStato() {
        return stato;
    }



    public void setStato(stato stato) {
        this.stato = stato;
    }



    public void setId(int id) {
        this.id = id;
    }

    
}
