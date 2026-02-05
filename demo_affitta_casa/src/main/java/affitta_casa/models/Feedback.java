package affitta_casa.models;

public class Feedback {
    private int id;
    private int id_prenotazione;
    private String titolo;
    private String testo;
    private int punteggio;

    public Feedback() {
    }

    public Feedback(int id_prenotazione, String titolo, String testo, int punteggio) {
        this.id_prenotazione = id_prenotazione;
        this.titolo = titolo;
        this.testo = testo;
        this.punteggio = punteggio;
    }

    // Getters e Setters
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getId_prenotazione() {
        return id_prenotazione;
    }

    public void setId_prenotazione(int id_prenotazione) {
        this.id_prenotazione = id_prenotazione;
    }

    public String getTitolo() {
        return titolo;
    }

    public void setTitolo(String titolo) {
        this.titolo = titolo;
    }

    public String getTesto() {
        return testo;
    }

    public void setTesto(String testo) {
        this.testo = testo;
    }

    public int getPunteggio() {
        return punteggio;
    }

    public void setPunteggio(int punteggio) {
        this.punteggio = punteggio;
    }
}
