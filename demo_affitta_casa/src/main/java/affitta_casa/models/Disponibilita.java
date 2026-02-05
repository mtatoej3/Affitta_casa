package affitta_casa.models;


import java.time.LocalDate;

public class Disponibilita {
    
    private int id;
    private Abitazione id_abitazione;
    private LocalDate data_inizio;
    private LocalDate data_fine;
    private double prezzo_periodo;
    
    
    


    public Disponibilita() {
    }


    public Disponibilita(Abitazione id_abitazione, LocalDate data_inizio, LocalDate data_fine, double prezzo_periodo) {
        this.id_abitazione = id_abitazione;
        this.data_inizio = data_inizio;
        this.data_fine = data_fine;
        this.prezzo_periodo = prezzo_periodo;
    }


    public int getId() {
        return id;
    }


    public void setId(int id) {
        this.id = id;
    }


    public Abitazione getId_abitazione() {
        return id_abitazione;
    }


    public void setId_abitazione(Abitazione id_abitazione) {
        this.id_abitazione = id_abitazione;
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


    public double getPrezzo_periodo() {
        return prezzo_periodo;
    }


    public void setPrezzo_periodo(double prezzo_periodo) {
        this.prezzo_periodo = prezzo_periodo;
    }
    
    
    

    
    
}
